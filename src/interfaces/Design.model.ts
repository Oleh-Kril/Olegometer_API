interface Design {
    width: number;
    designUrl: string;
    dynamicElements: Record<string, DynamicElement>;
    designSnapshotUrl?: string;
    websiteSnapshotUrl?: string;
    designSnapshotLastUpdated?: string;
    websiteSnapshotLastUpdated?: string;
}
