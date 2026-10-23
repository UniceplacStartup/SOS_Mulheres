import crypto from 'crypto';
import { AudioEvidence } from '../../core/entities';

/**
 * Adapter para gestão e integridade jurídica da Caixa-Preta de Áudio
 * Atende às diretrizes da Cadeia de Custódia (Lei Anticrime 13.964/2019, Art. 158-A do CPP)
 */
export class AudioStorageService {
  /**
   * Calcula o hash criptográfico SHA-256 de uma amostra de áudio (Buffer ou Base64)
   */
  calculateChecksum(audioData: Buffer | string): string {
    const hash = crypto.createHash('sha256');
    if (typeof audioData === 'string') {
      hash.update(audioData);
    } else {
      hash.update(audioData);
    }
    return hash.digest('hex');
  }

  /**
   * Valida a integridade da evidência gravada
   */
  verifyIntegrity(evidence: AudioEvidence, rawBuffer: Buffer): boolean {
    const computed = this.calculateChecksum(rawBuffer);
    return computed === evidence.sha256Checksum;
  }
}

export const audioStorageService = new AudioStorageService();
