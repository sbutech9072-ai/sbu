#!/usr/bin/env node
import { webcrypto } from 'node:crypto';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const cryptoSubtle = (globalThis.crypto && globalThis.crypto.subtle) ? globalThis.crypto : webcrypto;

export async function hashPassword(password, iterations = 100000) {
  const salt = cryptoSubtle.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await cryptoSubtle.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await cryptoSubtle.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256 // 32 bytes = 256 bits
  );

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `pbkdf2_sha256$${iterations}$${saltHex}$${hashHex}`;
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('\n--- Sbu Tech Admin Password Hasher (PBKDF2-SHA256) ---\n');
  const password = await rl.question('Enter administrator password to hash: ');
  rl.close();

  if (!password || password.length < 6) {
    console.error('\nError: Password must be at least 6 characters long.\n');
    process.exit(1);
  }

  const hashString = await hashPassword(password);
  console.log('\nGenerated ADMIN_PASSWORD_HASH:\n');
  console.log(hashString);
  console.log('\nAdd this value as ADMIN_PASSWORD_HASH in .dev.vars or Cloudflare Worker Secrets.\n');
}

// Only execute interactive CLI when run directly
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  main().catch((err) => {
    console.error('Hashing failed:', err);
    process.exit(1);
  });
}
