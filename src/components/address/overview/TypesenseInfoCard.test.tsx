import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import TypesenseInfoCard from "./TypesenseInfoCard";
import { renderWithProviders } from "@/lib/test-wrappers";
import type { TypesenseInfoSchema } from "@/schemas/typesense";

const baseSystemInfo: TypesenseInfoSchema = {
  health: true,
  systemCpuActivePercentage: 42,
  systemDiskTotalBytes: 1024 * 1024 * 1024, // 1 GB
  systemDiskUsedBytes: 512 * 1024 * 1024, // 512 MB
  systemMemoryTotalBytes: 2048 * 1024 * 1024,
  systemMemoryUsedBytes: 1024 * 1024 * 1024,
  systemNetworkSentBytes: 100 * 1024 * 1024,
  systemNetworkReceivedBytes: 200 * 1024 * 1024,
};

describe("TypesenseInfoCard", () => {
  it("renders the title", () => {
    renderWithProviders(<TypesenseInfoCard systemInfo={baseSystemInfo} />);
    expect(screen.getByText("Typesense Status")).toBeTruthy();
  });

  it("renders section labels", () => {
    renderWithProviders(<TypesenseInfoCard systemInfo={baseSystemInfo} />);
    expect(screen.getByText("CPU")).toBeTruthy();
    expect(screen.getByText("Disk:")).toBeTruthy();
    expect(screen.getByText("Memory:")).toBeTruthy();
    expect(screen.getByText("Network:")).toBeTruthy();
  });

  it("renders cpu percentage value", () => {
    renderWithProviders(<TypesenseInfoCard systemInfo={baseSystemInfo} />);
    expect(screen.getByText("42%")).toBeTruthy();
  });

  it("renders disk used bytes", () => {
    renderWithProviders(<TypesenseInfoCard systemInfo={baseSystemInfo} />);
    expect(screen.getByText("512.00 MB")).toBeTruthy();
  });

  it("shows healthy indicator when health is true", () => {
    renderWithProviders(<TypesenseInfoCard systemInfo={baseSystemInfo} />);
    const dot = document.querySelector(".bg-chart-2");
    expect(dot).not.toBeNull();
  });

  it("shows unhealthy indicator when health is false", () => {
    renderWithProviders(
      <TypesenseInfoCard systemInfo={{ ...baseSystemInfo, health: false }} />,
    );
    const dot = document.querySelector(".bg-chart-1");
    expect(dot).not.toBeNull();
  });
});
