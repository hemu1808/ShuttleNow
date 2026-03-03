import React from "react";
import { Box } from "@mui/material";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";

type Point = { topPct: number; leftPct: number };

export default function LiveMap({
  vehicle = { topPct: 30, leftPct: 50 },
  imageUrl,
  height = 400,
}: {
  vehicle?: Point;
  imageUrl?: string;
  height?: number;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.18)",
        backgroundColor: "rgba(0,0,0,0.1)",
        backdropFilter: "blur(8px)",
      }}
    >
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="Map"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          top: `${vehicle.topPct}%`,
          left: `${vehicle.leftPct}%`,
          transform: "translate(-50%, -50%)",
          transition: "top 1.2s linear, left 1.2s linear",
          color: "error.main",
        }}
      >
        <AirportShuttleIcon fontSize="large" />
      </Box>
    </Box>
  );
}
