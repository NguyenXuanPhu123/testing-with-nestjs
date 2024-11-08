/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as crypto from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'fs';

function checkExistFolder(name: string) {
  const check_path = path.join(__dirname, `../../${name}`);
  !fs.existsSync(check_path) && fs.mkdir(check_path, (err) => err);
}
function getAccessTokenKeyPair() {
  checkExistFolder('secure');
  const access_token_private_key_path = path.join(
    __dirname,
    '../../secure/access_token_private.key',
  );
  const access_token_public_key_path = path.join(
    __dirname,
    '../../secure/access_token_public.key',
  );
  // Check keys file exists
  const access_token_private_key_exists = fs.existsSync(
    access_token_private_key_path,
  );
  const access_token_public_key_exists = fs.existsSync(
    access_token_public_key_path,
  );
  if (!access_token_private_key_exists || !access_token_public_key_exists) {
    // If keys file not exist , create new
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Save pair keys
    fs.writeFileSync(access_token_private_key_path, privateKey);
    fs.writeFileSync(access_token_public_key_path, publicKey);
  }

  // Read pair keys from the file
  const access_token_private_key = fs.readFileSync(
    access_token_private_key_path,
    'utf-8',
  );
  const access_token_public_key = fs.readFileSync(
    access_token_public_key_path,
    'utf-8',
  );
  return {
    access_token_private_key,
    access_token_public_key,
  };
}

function getRefreshTokenKeyPair() {
  checkExistFolder('secure');
  const refresh_token_private_key_path = path.join(
    __dirname,
    '../../secure/refresh_token_private.key',
  );
  const refresh_token_public_key_path = path.join(
    __dirname,
    '../../secure/refresh_token_public.key',
  );
  // Check keys file exists
  const refresh_token_private_key_exists = fs.existsSync(
    refresh_token_private_key_path,
  );
  const refresh_token_public_key_exists = fs.existsSync(
    refresh_token_public_key_path,
  );
  if (!refresh_token_private_key_exists || !refresh_token_public_key_exists) {
    // If keys file not exist , create new
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Save pair keys
    fs.writeFileSync(refresh_token_private_key_path, privateKey);
    fs.writeFileSync(refresh_token_public_key_path, publicKey);
  }

  //  Read pair keys from the file
  const refresh_token_private_key = fs.readFileSync(
    refresh_token_private_key_path,
    'utf-8',
  );
  const refresh_token_public_key = fs.readFileSync(
    refresh_token_public_key_path,
    'utf-8',
  );
  return {
    refresh_token_private_key,
    refresh_token_public_key,
  };
}

export const { access_token_private_key, access_token_public_key } =
  getAccessTokenKeyPair();

export const { refresh_token_private_key, refresh_token_public_key } =
  getRefreshTokenKeyPair();
