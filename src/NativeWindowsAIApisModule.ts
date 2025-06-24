import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getPhiSilicaResponse(prompt: string) : Promise<string>;
}

export default TurboModuleRegistry.get<Spec>(
  'WindowsAIApisModule'
) as Spec | null;