#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { hashPassword } from './hash-admin-password.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.join(repoRoot, '.env'));
loadEnvFile(path.join(repoRoot, 'frontend', '.dev.vars'));

const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function printUsage() {
  console.log(`
SBU TECH Admin Provisioning CLI
===============================
Usage:
  node scripts/admin-users.mjs provision-owner --email <gmail> --name "<Full Name>"
  node scripts/admin-users.mjs provision-co-owner --email <gmail> --name "<Full Name>"
  node scripts/admin-users.mjs reset-password --email <gmail>
  node scripts/admin-users.mjs list

Options:
  --email <email>     Fixed Gmail address for the account
  --name "<name>"     Full name (required when provisioning)
  --password-stdin    Read password from stdin instead of interactive prompt
`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === '--password-stdin') {
      flags.passwordStdin = true;
    } else if (arg.startsWith('--') && i + 1 < rest.length) {
      flags[arg.slice(2)] = rest[++i];
    }
  }
  return { command, flags };
}

function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env or environment.');
    process.exit(1);
  }
}

async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = typeof data === 'object' && data?.message ? data.message : text;
    throw new Error(`Supabase API error (${res.status}): ${msg}`);
  }
  return data;
}

async function readPassword(useStdin) {
  if (useStdin) {
    const chunks = [];
    for await (const chunk of input) {
      chunks.push(chunk);
    }
    const pw = Buffer.concat(chunks).toString('utf-8').replace(/\r?\n$/, '');
    if (!pw || pw.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    return pw;
  }

  const rl = readline.createInterface({ input, output });
  try {
    const pw = await rl.question('Enter password (min 8 chars): ');
    if (!pw || pw.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    const confirm = await rl.question('Confirm password: ');
    if (pw !== confirm) {
      throw new Error('Passwords do not match.');
    }
    return pw;
  } finally {
    rl.close();
  }
}

async function provisionPrivilegedAccount(role, flags) {
  const email = (flags.email || '').trim().toLowerCase();
  const fullName = (flags.name || '').trim();

  if (!EMAIL_REGEX.test(email)) {
    console.error('Error: A valid --email address is required.');
    process.exit(1);
  }
  if (!fullName) {
    console.error('Error: --name "<Full Name>" is required.');
    process.exit(1);
  }

  // Enforce singleton constraint before prompting for password
  const existingRole = await supabaseFetch(
    `admin_users?role=eq.${encodeURIComponent(role)}&select=id,email,role`
  );
  if (Array.isArray(existingRole) && existingRole.length > 0) {
    console.error(
      `Error: A ${role === 'main_owner' ? 'Main Owner' : 'Co-owner'} account already exists (${existingRole[0].email}).`
    );
    console.error('Duplicate privileged accounts are strictly prohibited.');
    process.exit(1);
  }

  const existingEmail = await supabaseFetch(
    `admin_users?email=ilike.${encodeURIComponent(email)}&select=id,role`
  );
  if (Array.isArray(existingEmail) && existingEmail.length > 0) {
    console.error(`Error: An admin account with email "${email}" already exists.`);
    process.exit(1);
  }

  const password = await readPassword(Boolean(flags.passwordStdin));
  const passwordHash = await hashPassword(password);

  const permissions =
    role === 'main_owner'
      ? ['overview', 'users', 'accounts', 'projects', 'team', 'testimonials', 'messages', 'settings']
      : ['overview', 'users', 'accounts', 'projects', 'team', 'testimonials', 'messages'];

  const created = await supabaseFetch('admin_users', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      email,
      full_name: fullName,
      role,
      password_hash: passwordHash,
      is_active: true,
      permissions,
      token_version: 1,
    }),
  });

  const user = Array.isArray(created) ? created[0] : created;

  await supabaseFetch('admin_audit_logs', {
    method: 'POST',
    body: JSON.stringify({
      actor_id: user?.id || null,
      actor_email: 'cli-provisioning',
      actor_role: 'system_cli',
      target_id: user?.id || null,
      target_email: email,
      action: 'account_created',
      details: { role, source: 'cli' },
    }),
  });

  console.log(`\nSuccessfully provisioned ${role === 'main_owner' ? 'Main Owner' : 'Co-owner'} account:`);
  console.log(`  ID:    ${user?.id}`);
  console.log(`  Name:  ${fullName}`);
  console.log(`  Email: ${email}`);
  console.log(`  Role:  ${role}\n`);
}

async function resetAccountPassword(flags) {
  const email = (flags.email || '').trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    console.error('Error: A valid --email address is required.');
    process.exit(1);
  }

  const rows = await supabaseFetch(
    `admin_users?email=ilike.${encodeURIComponent(email)}&select=id,email,role,token_version`
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    console.error(`Error: No admin account found for "${email}".`);
    process.exit(1);
  }

  const target = rows[0];
  const password = await readPassword(Boolean(flags.passwordStdin));
  const passwordHash = await hashPassword(password);
  const nextVersion = (target.token_version || 1) + 1;

  await supabaseFetch(`admin_users?id=eq.${encodeURIComponent(target.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      password_hash: passwordHash,
      token_version: nextVersion,
      password_changed_at: new Date().toISOString(),
    }),
  });

  await supabaseFetch('admin_audit_logs', {
    method: 'POST',
    body: JSON.stringify({
      actor_id: null,
      actor_email: 'cli-provisioning',
      actor_role: 'system_cli',
      target_id: target.id,
      target_email: target.email,
      action: 'password_reset',
      details: { source: 'cli', token_version: nextVersion },
    }),
  });

  console.log(`\nPassword reset complete for ${target.email} (${target.role}). Previous sessions invalidated.\n`);
}

async function listAccounts() {
  const rows = await supabaseFetch(
    'admin_users?select=id,email,full_name,role,is_active,last_login_at,created_at&order=created_at.asc'
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log('\nNo admin accounts found in public.admin_users.\n');
    return;
  }
  console.log('\nSBU TECH Admin Accounts:');
  console.table(
    rows.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.full_name,
      role: r.role,
      active: r.is_active,
      last_login: r.last_login_at || 'never',
    }))
  );
}

async function main() {
  const { command, flags } = parseArgs(process.argv.slice(2));
  if (!command || command === '--help' || command === '-h') {
    printUsage();
    process.exit(0);
  }

  assertSupabaseConfig();

  switch (command) {
    case 'provision-owner':
      await provisionPrivilegedAccount('main_owner', flags);
      break;
    case 'provision-co-owner':
      await provisionPrivilegedAccount('co_owner', flags);
      break;
    case 'reset-password':
      await resetAccountPassword(flags);
      break;
    case 'list':
      await listAccounts();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Command failed:', err.message);
  process.exit(1);
});
