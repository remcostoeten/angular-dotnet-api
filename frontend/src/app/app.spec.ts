import { apiConfig } from './core/config/api.config';

describe('Api config should contain localhost endpoint', () => {
  it('should have assessmentApiBaseUrl pointing to localhost', () => {
    expect(apiConfig.assessmentApiBaseUrl).toContain('localhost');
  });
});
