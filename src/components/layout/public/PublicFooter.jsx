// import React from "react";

// const PublicFooter = () => {
//   return <div>PublicFooter</div>;
// };

// export default PublicFooter;
import OpacityIcon from "@mui/icons-material/Opacity";

export default function PublicFooter() {
  return (
    <footer className="bg-[#0A1929] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <OpacityIcon className="text-white" sx={{ fontSize: 14 }} />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            GreazeBook
          </span>
        </div>
        <p className="text-xs text-blue-300/50">
          © {new Date().getFullYear()} GreazeBook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
