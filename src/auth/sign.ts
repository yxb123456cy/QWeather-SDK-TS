/** 鉴权材料:仅 key,或 key + token + 私钥 */
export interface Credential {
  /** API Key */
  key: string;
  /** Token(订阅用户,签名鉴权) */
  token?: string;
  /** PEM 编码的 ED25519 私钥 */
  privateKey?: string;
}

/**
 * 对单个请求生成鉴权后的 query 参数。
 * - 普通 API Key:附加 `key=...`
 * - 签名鉴权:按 key 字典序拼接 + ED25519 签名后追加 `t` 与 `sign`
 */
export async function signRequest(
  path: string,
  params: Record<string, string>,
  credential: Credential,
): Promise<Record<string, string>> {
  if (!credential.token || !credential.privateKey) {
    return { ...params, key: credential.key };
  }

  const { createPrivateKey, sign: cryptoSign } = await import('node:crypto');
  const sorted = Object.entries({ ...params, publicId: credential.token })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  const payload = `${path}?${sorted}`;
  const keyObj = createPrivateKey(credential.privateKey);
  const sig = cryptoSign(null, Buffer.from(payload), keyObj).toString('base64');
  return { ...params, t: credential.token, sign: sig };
}
