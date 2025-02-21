// // app/protected/manageTerminals/[terminalID]/ProviderSelection.tsx
// import React from "react";
// import { Button } from "@mui/material";

// const providers = [
//   { name: "MTN", image: "/images/mtn.png" },
//   { name: "Vodacom", image: "/images/vodacom.png" },
//   { name: "Cell C", image: "/images/cellc.png" },
//   { name: "Telkom", image: "/images/telkom.jpeg" },
//   { name: "OTT", image: "/images/ott_logo.png" },
// ];

// const ProviderSelection = ({ selectedProvider, onSelect }) => (
//   <div className="mt-4 grid grid-cols-4 gap-4">
//     {providers.map((provider) => (
//       <Button
//         key={provider.name}
//         variant={selectedProvider === provider.name ? "contained" : "outlined"}
//         onClick={() => onSelect(provider.name)}
//         fullWidth
//       >
//         <img
//           src={provider.image}
//           alt={provider.name}
//           className="mr-2 h-12 w-auto"
//         />
//       </Button>
//     ))}
//   </div>
// );

// export default ProviderSelection;

// import React from "react";
// import { Grid, Card, CardActionArea, CardMedia } from "@mui/material";

// const providers = [
//   { name: "MTN", image: "/images/mtn.png" },
//   { name: "Vodacom", image: "/images/vodacom.png" },
//   { name: "Cell C", image: "/images/cellc.png" },
//   { name: "Telkom", image: "/images/telkom.jpeg" },
//   { name: "OTT", image: "/images/ott_logo.png" },
// ];

// const ProviderSelection = ({ selectedProvider, onSelect }) => (
//   <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
//     {providers.map((provider) => (
//       <Grid item xs={6} sm={2.4} key={provider.name}>
//         <Card
//           onClick={() => onSelect(provider.name)}
//           sx={{
//             cursor: "pointer",
//             borderRadius: 2,
//             boxShadow:
//               selectedProvider === provider.name
//                 ? "0px 4px 12px rgba(0,0,0,0.3)"
//                 : "none",
//             border:
//               selectedProvider === provider.name
//                 ? "2px solid #1976D2"
//                 : "1px solid #ddd",
//             transition: "all 0.2s ease-in-out",
//             "&:hover": {
//               boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
//             },
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             height: 100, // Ensures a consistent height
//           }}
//         >
//           <CardActionArea>
//             <CardMedia
//               component="img"
//               image={provider.image}
//               alt={provider.name}
//               sx={{
//                 height: 60,
//                 objectFit: "contain",
//                 mx: "auto", // Center the image horizontally
//                 my: "auto", // Center the image vertically
//               }}
//             />
//           </CardActionArea>
//         </Card>
//       </Grid>
//     ))}
//   </Grid>
// );

// export default ProviderSelection;

"use client";

import React from "react";
import { Grid, Card, CardActionArea, CardMedia } from "@mui/material";

// ✅ Hardcoded list of providers
const providers = [
  { name: "MTN", image: "/images/mtn.png" },
  { name: "Vodacom", image: "/images/vodacom.png" },
  { name: "Cell C", image: "/images/cellc.png" },
  { name: "Telkom", image: "/images/telkom.jpeg" },
  { name: "OTT", image: "/images/ott_logo.png" },
];

const ProviderSelection = ({ selectedProvider, onSelect }) => (
  <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
    {providers.map((provider) => (
      <Grid item xs={6} sm={2.4} key={provider.name}>
        <Card
          onClick={() => onSelect(provider.name)}
          sx={{
            cursor: "pointer",
            borderRadius: 2,
            boxShadow:
              selectedProvider === provider.name
                ? "0px 4px 12px rgba(0,0,0,0.3)"
                : "none",
            border:
              selectedProvider === provider.name
                ? "2px solid #1976D2"
                : "1px solid #ddd",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 100, // Ensures a consistent height
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              image={provider.image}
              alt={provider.name}
              sx={{
                height: 60,
                objectFit: "contain",
                mx: "auto", // Center the image horizontally
                my: "auto", // Center the image vertically
              }}
            />
          </CardActionArea>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default ProviderSelection;
