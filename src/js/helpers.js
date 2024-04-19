import { TIMEOUT_SEC } from './config';

export function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

export async function ajax(url, uploadData = undefined) {
  const headers = uploadData
    ? {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }
    : null;
  const fetchPro = fetch(url, headers);
  const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  return data;
}

// export async function getJSON(url) {
//   const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//   const data = await res.json();
//   if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//   return data;
// }

// export async function sendJSON(url, uploadData) {
//   const res = await Promise.race([
//     fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     }),
//     timeout(TIMEOUT_SEC),
//   ]);
//   const data = await res.json();
//   if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//   return data;
// }

export async function deleteRecipe(url, id) {
  const res = await Promise.race([
    fetch(url, {
      method: 'DELETE',
    }),
    timeout(TIMEOUT_SEC),
  ]);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  return data;
}
