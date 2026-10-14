/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrackDefinition } from './rhythm';

export interface DrumKitDefinition {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tracks: TrackDefinition[];
}
