// components/assistant/Assistant.tsx  (atau file yang kamu pakai)
"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import SimpleChat from "@/components/simple/simple-chat";

export const Assistant = () => {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <ConnectButton />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Paycombat Copilot</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* SimpleChat menggantikan Thread/SDK */}
        <SimpleChat />
      </SidebarInset>
    </SidebarProvider>
  );
};
