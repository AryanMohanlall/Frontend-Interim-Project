export async function getSecretKey(password) {
  const encoder = new TextEncoder();
  const rawKey = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  return crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

const MASTER_PASS = "shrek-all-day-long";

export const encryptPassword = async (plain) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getSecretKey(MASTER_PASS);
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain)
  );

  const ivString = btoa(String.fromCharCode(...iv));
  const dataString = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  
  return `${ivString}:${dataString}`; 
};

export const decryptPassword = async (cipher) => {
  const [ivString, dataString] = cipher.split(':');
  
  const iv = Uint8Array.from(atob(ivString), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(dataString), c => c.charCodeAt(0));
  const key = await getSecretKey(MASTER_PASS);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    return "";
  }
};

