
type TemplateName = 'classic' | 'modern' | 'minimal' | 'bold' | 'elegant';

type TemplateStyles = {
  [key in TemplateName]: {
    name: string;
    font: string;
    preview: {
      background: string;
      primary: string;
      secondary: string;
    };
    styles: {
      container: string;
      header: string;
      fromTo: string;
      tableHeader: string;
      tableRow: string;
      totals: string;
      totalRow: string;
      footer: string;
    };
  };
};

export const templates: TemplateStyles = {
  classic: {
    name: "Classic",
    font: "[font-family:Merriweather,serif]",
    preview: { background: "bg-gray-100", primary: "bg-gray-800", secondary: "bg-gray-200" },
    styles: {
      container: "bg-white text-gray-800",
      header: "border-b-2 border-gray-800 pb-4 mb-8",
      fromTo: "text-sm",
      tableHeader: "bg-gray-100 border-b-2 border-gray-300 font-bold text-gray-900",
      tableRow: "border-b border-gray-200",
      totals: "",
      totalRow: "border-t-2 border-gray-800 text-gray-900",
      footer: "text-center text-xs text-gray-500 pt-4 mt-8 border-t",
    },
  },
  modern: {
    name: "Modern",
    font: "[font-family:Roboto,sans-serif]",
    preview: { background: "bg-white", primary: "bg-blue-600", secondary: "bg-blue-100" },
    styles: {
      container: "bg-white text-gray-900",
      header: "mb-10",
      fromTo: "text-sm",
      tableHeader: "bg-blue-50 text-blue-700 font-medium uppercase tracking-wider text-xs",
      tableRow: "border-b border-gray-200",
      totals: "",
      totalRow: "text-blue-700",
      footer: "text-center text-xs text-gray-500 pt-4 mt-8",
    },
  },
  minimal: {
    name: "Minimal",
    font: "[font-family:Lato,sans-serif]",
    preview: { background: "bg-white", primary: "bg-black", secondary: "bg-gray-100" },
    styles: {
      container: "bg-white text-black",
      header: "mb-12",
      fromTo: "text-xs mb-10",
      tableHeader: "border-b-2 border-black font-bold uppercase tracking-widest text-xs",
      tableRow: "border-b border-gray-200",
      totals: "mt-8",
      totalRow: "border-t border-black",
      footer: "text-center text-xs text-gray-400 pt-4 mt-8",
    },
  },
  bold: {
    name: "Bold",
    font: "[font-family:Montserrat,sans-serif]",
    preview: { background: "bg-gray-800", primary: "bg-yellow-400", secondary: "bg-gray-700" },
    styles: {
      container: "bg-gray-900 text-white",
      header: "mb-8 bg-gray-800 p-6 rounded-lg",
      fromTo: "text-sm",
      tableHeader: "bg-yellow-400 text-gray-900 uppercase text-sm font-bold",
      tableRow: "border-b border-gray-700",
      totals: "",
      totalRow: "text-yellow-400",
      footer: "text-center text-sm text-gray-400 pt-4 mt-8 border-t border-gray-700",
    },
  },
  elegant: {
    name: "Elegant",
    font: "[font-family:'Playfair_Display',serif]",
    preview: { background: "bg-[#FBF9F6]", primary: "bg-[#4B4237]", secondary: "bg-[#EAE6E1]" },
    styles: {
      container: "bg-[#FBF9F6] text-[#4B4237]",
      header: "text-center mb-12",
      fromTo: "text-sm",
      tableHeader: "border-b border-t border-[#DCD6CC] font-normal text-[#4B4237] uppercase text-xs tracking-widest",
      tableRow: "border-b border-[#EAE6E1]",
      totals: "",
      totalRow: "text-[#4B4237]",
      footer: "text-center text-sm text-[#928B81] pt-6 mt-10 border-t border-[#EAE6E1]",
    },
  },
};
