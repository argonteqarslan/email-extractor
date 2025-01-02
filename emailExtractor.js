const cheerio = require("cheerio");

function extractLatestEmail(rawHtml) {
  if (!rawHtml || typeof rawHtml !== "string") {
    return "";
  }

  const $ = cheerio.load(rawHtml);

  const knownReplySelectors = [
    "blockquote",
    "div#divRplyFwdMsg",
    "div#x_divRplyFwdMsg",
    "div#gmail_quote",
    "div.gmail_quote",
    "div.gmail_quote_container",
    "blockquote.gmail_quote",
    'blockquote[type="cite"]',
    "blockquote.yahoo_quoted",
    "div.quote",
    "div#forwarded",
    "div#replied",
    "div#replybody",
    "div#messagebody",
    "div.forward-message",
    "div.forwarded-message",
    "div.quoted-message",
    "div.email-quote",
    "div.message-quote",
    "div.moz-cite-prefix",
    "div#mail-reply-body",
    "blockquote[style*='border-left']",
    "div#original-message",
    "div.email-body-inner",
    "div.original-message",
    "table.email-footer",
    "div#quoted-reply",
    "div#reply-wrapper",
    "div#fwd-wrapper",
    "div[dir='ltr'] blockquote",
    "div.gmail_attr",
    "table[role='presentation'] blockquote",
    "table[role='presentation'] div.gmail_quote",
    "div[style*='margin-top'] blockquote",
    "div.OutlookMessageHeader",
    "div.OutlookMessageContent",
    "div[id^='divRplyFwdMsg']",
    "table.moz-email-headers-table",
    "td.moz-email-headers-left",
    "span.moz-email-headers-text",
    "div[style*='border-left: #ccc 1px solid']",
    "div[style*='border-left: rgb(204, 204, 204) 1px solid']",
    "blockquote[class*='AppleMailQuote']",
    "blockquote[id^='com.apple.mail']",
    "div[class*='Apple-interchange-newline']",
    "div[id^='appleMailQuote']",
    "div[id^='yahoo-com']",
    "blockquote[class*='yahoo_quoted']",
    "span.yahoo_quoted",
    "div.hc-message",
    "blockquote.hcl-quote",
    "div[class*='reply-quote']",
    "div[class*='forward-quote']",
    "div[style*='color: #666'] blockquote",
    "table[border='0'][cellpadding='0'][cellspacing='0'] blockquote",
    "blockquote[style*='margin:0 0 0 .8ex']",
    "blockquote[style*='margin: 0px; padding: 0px; border: none;']",
  ];

  // Remove known selectors
  knownReplySelectors.forEach((selector) => {
    $(selector).remove();
  });

  let cleanedText = $("body").text() || "";

  const olderContentMarkers = [
    /From:\s.+/i,
    /-{5,}.*Original Message.*/i,
    /On\s.+\swrote:/i,
    /Subject:\sRe:/i,
  ];

  let earliestMatchIndex = cleanedText.length;
  for (const pattern of olderContentMarkers) {
    const match = cleanedText.match(pattern);
    if (match && match.index < earliestMatchIndex) {
      earliestMatchIndex = match.index;
    }
  }

  if (earliestMatchIndex !== cleanedText.length) {
    cleanedText = cleanedText.substring(0, earliestMatchIndex);
  }

  // Collapse multiple newlines into one
  cleanedText = cleanedText.replace(/\n\s*\n/g, "\n");

  return cleanedText.trim();
}

module.exports = {
  extractLatestEmail,
};
