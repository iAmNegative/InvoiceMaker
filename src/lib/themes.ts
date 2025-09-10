
type TemplateName = 'classic' | 'modern' | 'minimal' | 'bold' | 'elegant';

type TemplateStyles = {
  [key in TemplateName]: {
    name: string;
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
      footer: string;
    };
  };
};

export const templates: TemplateStyles = {
  classic: {
    name: "Classic",
    preview: { background: "bg-white", primary: "bg-slate-700", secondary: "bg-slate-200" },
    styles: {
      container: "bg-white text-slate-800 p-10",
      header: "border-b-2 border-slate-800 pb-4 mb-8",
      fromTo: "text-sm",
      tableHeader: "bg-slate-100 border-b-2 border-slate-300 font-semibold",
      tableRow: "border-b border-slate-200",
      totals: "text-right",
      footer: "text-center text-xs text-slate-500 pt-4 mt-8 border-t",
    },
  },
  modern: {
    name: "Modern",
    preview: { background: "bg-white", primary: "bg-primary", secondary: "bg-gray-100" },
    styles: {
      container: "bg-white text-gray-900 p-10",
      header: "mb-10",
      fromTo: "text-sm",
      tableHeader: "bg-primary/10 text-primary font-semibold uppercase tracking-wider text-xs",
      tableRow: "border-b border-gray-200",
      totals: "text-right",
      footer: "text-center text-xs text-gray-500 pt-4 mt-8",
    },
  },
  minimal: {
    name: "Minimal",
    preview: { background: "bg-white", primary: "bg-black", secondary: "bg-gray-100" },
    styles: {
      container: "bg-white text-black p-10",
      header: "mb-12",
      fromTo: "text-xs mb-10",
      tableHeader: "border-b-2 border-black font-bold uppercase tracking-widest text-xs",
      tableRow: "border-b border-gray-200",
      totals: "text-right mt-8",
      footer: "text-center text-xs text-gray-400 pt-4 mt-8",
    },
  },
  bold: {
    name: "Bold",
    preview: { background: "bg-gray-800", primary: "bg-accent", secondary: "bg-gray-700" },
    styles: {
      container: "bg-gray-800 text-white p-10",
      header: "mb-8",
      fromTo: "text-sm",
      tableHeader: "bg-accent text-accent-foreground uppercase text-xs font-bold",
      tableRow: "border-b border-gray-700",
      totals: "text-right",
      footer: "text-center text-xs text-gray-400 pt-4 mt-8 border-t border-gray-700",
    },
  },
  elegant: {
    name: "Elegant",
    preview: { background: "bg-[#FBF9F6]", primary: "bg-[#4B4237]", secondary: "bg-[#EAE6E1]" },
    styles: {
      container: "bg-[#FBF9F6] text-[#4B4237] p-12",
      header: "text-center mb-12",
      fromTo: "text-sm",
      tableHeader: "border-b border-[#DCD6CC] font-normal text-[#4B4237] uppercase text-xs tracking-widest",
      tableRow: "border-b border-[#EAE6E1]",
      totals: "text-right",
      footer: "text-center text-sm text-[#928B81] pt-6 mt-10 border-t border-[#EAE6E1]",
    },
  },
};
