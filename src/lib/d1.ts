/**
 * Cloudflare D1 Database Client
 * Works seamlessly in Edge Runtime, Node.js, and Cloudflare Pages
 */

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || "3c62fd7b101cb45266bcca6237c80f58";
const CF_D1_DB_ID = process.env.CF_D1_DB_ID || "7309aefc-20f6-46b4-9c25-1fc0ffee0597";
const CF_AUTH_EMAIL = process.env.CF_AUTH_EMAIL || "ceo.shubhampathak@gmail.com";
const CF_API_KEY = process.env.CF_API_KEY || "";

export interface D1QueryResult<T = any> {
  results: T[];
  success: boolean;
  meta?: any;
}

export async function d1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DB_ID}/query`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "X-Auth-Email": CF_AUTH_EMAIL,
        "X-Auth-Key": CF_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("D1 Query HTTP error:", res.status, errorText);
      throw new Error(`D1 HTTP error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) {
      console.error("D1 Query failure:", data.errors);
      throw new Error(data.errors?.[0]?.message || "D1 Query failed");
    }

    const firstResult = data.result?.[0];
    return (firstResult?.results as T[]) || [];
  } catch (err) {
    console.error("D1 query exception:", err);
    throw err;
  }
}

export async function d1Execute(sql: string, params: any[] = []): Promise<boolean> {
  const results = await d1Query(sql, params);
  return true;
}

export default { query: d1Query, execute: d1Execute };
