import { ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Search } from "./search";

export class Scan extends Search {
  segment?: number;
  totalSegments?: number;

  async run(): Promise<ScanCommandOutput> { return this._client!.send(new ScanCommand(this.build())); }

  build(): ScanCommandInput {
    const scan: ScanCommandInput = super.build();
    if (this.segment !== undefined) { scan.Segment = this.segment; }
    if (this.totalSegments !== undefined) { scan.TotalSegments = this.totalSegments; }
    return scan;
  }
}
