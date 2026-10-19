/**
 * Cloudflare API Integration Helper for ZeForm
 * Handles DNS records and zone status for zeform.zenstro.space
 */

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

export interface CloudflareDnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
}

export async function testCloudflareConnection(): Promise<{
  success: boolean;
  message: string;
  zoneName?: string;
}> {
  if (!CLOUDFLARE_API_TOKEN) {
    return {
      success: false,
      message: "CLOUDFLARE_API_TOKEN is not set in .env",
    };
  }

  try {
    const res = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.errors?.[0]?.message || "Invalid Cloudflare Token" };
    }

    if (CLOUDFLARE_ZONE_ID) {
      const zoneRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const zoneData = await zoneRes.json();
      if (zoneData.success) {
        return {
          success: true,
          message: "Connected to Cloudflare successfully!",
          zoneName: zoneData.result?.name,
        };
      }
    }

    return {
      success: true,
      message: "Cloudflare API Token verified successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reach Cloudflare API",
    };
  }
}

/**
 * Creates or updates a CNAME record for a custom subdomain if explicit DNS record is desired
 */
export async function createSubdomainDnsRecord(subdomain: string, target = "zeform.zenstro.space"): Promise<{
  success: boolean;
  message: string;
  record?: CloudflareDnsRecord;
}> {
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
    return {
      success: true,
      message: "Wildcard DNS active. Individual Cloudflare record skipped (Token or Zone ID not provided).",
    };
  }

  const recordName = `${subdomain}.zeform.zenstro.space`;

  try {
    const checkRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records?name=${recordName}`,
      {
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    const checkData = await checkRes.json();

    if (checkData.success && checkData.result?.length > 0) {
      return {
        success: true,
        message: `DNS record for ${recordName} already exists on Cloudflare.`,
        record: checkData.result[0],
      };
    }

    // Create new CNAME record
    const createRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CNAME",
          name: recordName,
          content: target,
          ttl: 1, // Auto
          proxied: true,
        }),
      }
    );

    const createData = await createRes.json();
    if (!createData.success) {
      return {
        success: false,
        message: createData.errors?.[0]?.message || "Failed to create DNS record",
      };
    }

    return {
      success: true,
      message: `Subdomain ${recordName} successfully registered in Cloudflare DNS!`,
      record: createData.result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Cloudflare DNS API request failed",
    };
  }
}
