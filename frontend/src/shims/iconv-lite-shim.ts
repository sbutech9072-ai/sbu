// Lightweight edge shim for iconv-lite using standard Web TextDecoder/TextEncoder
const shim = {
  encodingExists: (_encoding: string) => true,
  decode: (buf: Buffer | Uint8Array, encoding?: string) => {
    try {
      return new TextDecoder(encoding || 'utf-8').decode(buf);
    } catch {
      return new TextDecoder('utf-8').decode(buf);
    }
  },
  encode: (str: string) => new TextEncoder().encode(str),
  getCodec: () => null,
  getEncoder: () => null,
  getDecoder: () => null,
};

export const encodingExists = shim.encodingExists;
export const decode = shim.decode;
export const encode = shim.encode;

export default shim;

