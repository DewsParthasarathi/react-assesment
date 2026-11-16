export const DASHBOARD_TRANSLATIONS: Record<string, string> = {
  "Congratulations John!": "வாழ்த்துகள் ஜான்!",
  "Welcome": "வரவேற்பு",
  "Order": "ஆர்டர்",
  "Sales": "விற்பனை",
  "Total Revenue": "மொத்த வருவாய்",
  "Company Growth": "நிறுவன வளர்ச்சி",
  "Payments": "பணம் செலுத்துதல்கள்",
  "Revenue": "வருவாய்",
  "Profit Report": "லாப அறிக்கை",
  "Order Statistics": "ஆர்டர் புள்ளிவிவரங்கள்",
  "INCOME": "வருமானம்",
  "EXPENSES": "செலவுகள்",
  "PROFIT": "லாபம்",
  "Total Income": "மொத்த வருமானம்",
  "Transactions": "பரிவர்த்தனைகள்",
  "Activity Timeline": "செயல்பாட்டு காலவரிசை",
  "Browser Analytics": "உலாவி பகுப்பாய்வு",
  "BROWSER": "உலாவி",
  "OPERATING SYSTEM": "இயக்க முறைமை",
  "COUNTRY": "நாடு",
  "Customer Ratings": "வாடிக்கையாளர் மதிப்பீடுகள்",
  "Overview & Sales Activity": "மேலோட்டம் & விற்பனை செயல்பாடு",
  "Overview": "மேலோட்டம்",
  "Sales Activity": "விற்பனை செயல்பாடு",
  "Sessions": "அமர்வுகள்",
  "sessions": "அமர்வுகள்",
  "Order Summary": "ஆர்டர் சுருக்கம்",
  "Generated Leads": "உருவாக்கப்பட்ட வாய்ப்புகள்",
  "Top Products by Sales": "விற்பனையில் சிறந்த தயாரிப்புகள்",
  "Top Products by Volume": "அளவில் சிறந்த தயாரிப்புகள்",
  "Earning Report": "வருவாய் அறிக்கை",
  "Net Profit": "நிகர லாபம்",
  "Total Expenses": "மொத்த செலவுகள்",
  "Weekly Earnings Overview": "வாராந்திர வருவாய் மேலோட்டம்",
  "Sales Analytics": "விற்பனை பகுப்பாய்வு",
  "Sales by countries": "நாடுகள் வாரியான விற்பனை",
  "Sales by Countries": "நாடுகள் வாரியான விற்பனை",
  "Sales Status": "விற்பனை நிலை",
  "Employee Performance": "ஊழியர் செயல்திறன்",
  "Customer Transactions": "வாடிக்கையாளர் பரிவர்த்தனைகள்",
  "New Visitors": "புதிய பார்வையாளர்கள்",
  "Activity": "செயல்பாடு",
  "Profit": "லாபம்",
  "Expenses": "செலவுகள்",
  "Report": "அறிக்கை",
  "Performance": "செயல்திறன்",
  "Conversion Rate": "மாற்ற விகிதம்",
  "Sales Summary": "விற்பனை சுருக்கம்",
  "Profit Target": "லாப இலக்கு",
  "Sales Target": "விற்பனை இலக்கு",
  "Expenses Comparison": "செலவுகள் ஒப்பீடு",
  "Product Transactions": "தயாரிப்பு பரிவர்த்தனைகள்",
  "Total Balance": "மொத்த இருப்பு",
  "Total Sales": "மொத்த விற்பனை",
  "Total Customers": "மொத்த வாடிக்கையாளர்கள்",
  "Total Orders": "மொத்த ஆர்டர்கள்",
  "Monthly Revenue": "மாதாந்திர வருவாய்",
  "Sales Overview": "விற்பனை மேலோட்டம்",
  "Recent Orders": "சமீபத்திய ஆர்டர்கள்",
  "Customer Growth": "வாடிக்கையாளர் வளர்ச்சி",
};

export const translateWidgetTitle = (
  text: string,
  language: string = "en",
): string => {
  if (language !== "ta" || !text) {
    return text;
  }

  const directMatch = DASHBOARD_TRANSLATIONS[text];
  if (directMatch) {
    return directMatch;
  }

  const trimmed = text.trim();
  const trimmedMatch = DASHBOARD_TRANSLATIONS[trimmed];
  if (trimmedMatch) {
    return trimmedMatch;
  }

  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(DASHBOARD_TRANSLATIONS)) {
    if (key.toLowerCase() === lower) {
      return val;
    }
  }

  return text;
};
