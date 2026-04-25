export function getOrderConfirmationEmailHtml(
  customerName: string,
  orderNumber: string,
  items: any[],
  total: number,
  address: string,
  paymentMethod: string,
  orderTime: string,
): string {
  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E5E0D8;">
        <div style="font-weight: 600; color: #2C2926; font-size: 14px; text-transform: uppercase;">${item.name}</div>
        <div style="color: #8B857A; font-size: 12px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #E5E0D8; text-align: right; font-weight: 600; color: #2C2926;">
        $${(item.discount * item.quantity).toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9F8F6; color: #2C2926;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9F8F6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #E5E0D8; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
              <!-- Header -->
              <tr>
                <td style="padding: 60px 40px 40px 40px; text-align: center;">
                  <div style="font-size: 12px; font-weight: bold; letter-spacing: 0.3em; text-transform: uppercase; color: #8B857A; margin-bottom: 16px;">Tiger Balm • Havenly</div>
                  <h1 style="margin: 0; font-size: 32px; font-weight: bold; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.1;">Order Confirmed</h1>
                  <p style="margin: 20px 0 0 0; color: #8B857A; font-size: 14px; font-weight: 500;">Thank you for your purchase, ${customerName}. Your architectural sanctuary is being prepared.</p>
                </td>
              </tr>
              
              <!-- Order Info Grid -->
              <tr>
                <td style="padding: 0 40px 20px 40px;">
                  <div style="border-top: 2px solid #2C2926; padding-top: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding-bottom: 20px;">
                          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8B857A; margin-bottom: 4px;">Order Number</div>
                          <div style="font-size: 14px; font-weight: bold; color: #2C2926;">#${orderNumber}</div>
                        </td>
                        <td width="50%" style="padding-bottom: 20px; text-align: right;">
                          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8B857A; margin-bottom: 4px;">Order Time</div>
                          <div style="font-size: 14px; font-weight: bold; color: #2C2926;">${orderTime}</div>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding-bottom: 20px;">
                          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8B857A; margin-bottom: 4px;">Payment Method</div>
                          <div style="font-size: 14px; font-weight: bold; color: #2C2926; text-transform: uppercase;">${paymentMethod}</div>
                        </td>
                        <td width="50%" style="padding-bottom: 20px; text-align: right;">
                          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8B857A; margin-bottom: 4px;">Shipping To</div>
                          <div style="font-size: 14px; font-weight: bold; color: #2C2926;">${address}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <thead>
                      <tr>
                        <th align="left" style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8B857A; padding-bottom: 12px; border-bottom: 1px solid #2C2926;">Item Selection</th>
                        <th align="right" style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8B857A; padding-bottom: 12px; border-bottom: 1px solid #2C2926;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemRows}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style="padding: 24px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Grand Total Investment</td>
                        <td align="right" style="padding: 24px 0 0 0; font-size: 24px; font-weight: bold;">$${total.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </td>
              </tr>
              
              <!-- CTA -->
              <tr>
                <td style="padding: 0 40px 60px 40px; text-align: center;">
                  <a href="http://localhost:5173/track-order?id=${orderNumber}" style="display: inline-block; padding: 20px 40px; background-color: #2C2926; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; transition: all 0.3s ease;">Live Tracking Dashboard</a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 40px; background-color: #F4F1ED; text-align: center;">
                  <p style="margin: 0; font-size: 11px; line-height: 1.8; color: #8B857A; font-weight: 500;">
                    Questions regarding your architectural selection? Reply to this email.<br>
                    © 2026 Tiger Balm Furniture • Havenly Design Studio. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim();
}
