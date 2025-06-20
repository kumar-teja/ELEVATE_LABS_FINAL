import { CircularProgress, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const LoaderWrapper = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Ensures the loader is on top of other content
}));

export const Loader = () => (
    <LoaderWrapper>
        <CircularProgress color="secondary" />
    </LoaderWrapper>
);
