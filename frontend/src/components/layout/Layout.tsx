import LayoutFooter from "@components/layout/LayoutFooter";
import LayoutHeader from "@components/layout/LayoutHeader";
import { Box } from "@mantine/core";

interface LayoutProps {}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box mih={"100%"} h={"100%"}>
      <LayoutHeader />
      {/* Height calculated from full height (100% - Header - Footer) */}
      <Box mih={"calc(100% - (84px + 24px) - (50px + 32px))"}>{children}</Box>
      <LayoutFooter />
    </Box>
  );
};

export default Layout;
