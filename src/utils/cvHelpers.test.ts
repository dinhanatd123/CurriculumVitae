import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMarqueeItems,
  buildPdfDocumentTitle,
  computeAutoZoomScale,
  computeHeroActIndex,
  getContrastTextColor,
  moveItem,
  validateAndNormalizeCvState,
} from './cvHelpers';
import { createSampleCvState } from '../data/sampleCv';

test('buildPdfDocumentTitle strips Vietnamese diacritics including đ/Đ', () => {
  assert.equal(
    buildPdfDocumentTitle('Nguyễn Minh Khôi', 'Senior Frontend Engineer'),
    'CV_Nguyen_Minh_Khoi_Senior_Frontend_Engineer'
  );
  assert.equal(
    buildPdfDocumentTitle('Đặng Thị Phương Thảo', 'Kỹ sư Phần mềm'),
    'CV_Dang_Thi_Phuong_Thao_Ky_su_Phan_mem'
  );
  assert.equal(buildPdfDocumentTitle('', ''), 'CV_Chuyen_Nghiep');
});

test('computeHeroActIndex maps scroll progress accurately across 3 acts', () => {
  assert.equal(computeHeroActIndex(0), 0);
  assert.equal(computeHeroActIndex(0.33), 0);
  assert.equal(computeHeroActIndex(0.35), 1);
  assert.equal(computeHeroActIndex(0.67), 1);
  assert.equal(computeHeroActIndex(0.68), 2);
  assert.equal(computeHeroActIndex(1), 2);
});

test('buildMarqueeItems deduplicates skills, strengths, and certificates cleanly', () => {
  const sample = createSampleCvState();
  const items = buildMarqueeItems(sample.data);
  assert.ok(items.includes('React & TypeScript'));
  assert.ok(items.includes('AWS Certified Cloud Practitioner'));
  const lower = items.map((i) => i.toLowerCase());
  assert.equal(new Set(lower).size, lower.length);
});

test('moveItem reorders immutably and guards out-of-bounds indices', () => {
  const list = ['A', 'B', 'C'];
  assert.deepEqual(moveItem(list, 1, 'up'), ['B', 'A', 'C']);
  assert.deepEqual(moveItem(list, 1, 'down'), ['A', 'C', 'B']);
  assert.deepEqual(moveItem(list, 0, 'up'), ['A', 'B', 'C']);
  assert.deepEqual(moveItem(list, 2, 'down'), ['A', 'B', 'C']);
  assert.deepEqual(list, ['A', 'B', 'C']);
});

test('computeAutoZoomScale fits A4 cleanly across desktop and mobile containers', () => {
  assert.equal(computeAutoZoomScale(900), 1.05);
  assert.equal(computeAutoZoomScale(700), 0.81);
  assert.equal(computeAutoZoomScale(390), 0.46);
  assert.equal(computeAutoZoomScale(0), 1);
});

test('getContrastTextColor returns accessible ink for dark and light custom colors', () => {
  assert.equal(getContrastTextColor('#0B1F3A'), '#FFFFFF');
  assert.equal(getContrastTextColor('#0F5C5C'), '#FFFFFF');
  assert.equal(getContrastTextColor('#FDE047'), '#0F172A');
  assert.equal(getContrastTextColor('#E2E8F0'), '#0F172A');
});

test('validateAndNormalizeCvState validates v1/v2 payloads and rejects malformed JSON', () => {
  const sample = createSampleCvState();
  const validResult = validateAndNormalizeCvState(sample);
  assert.equal(validResult.ok, true);
  if (validResult.ok) {
    assert.equal(validResult.state.data.personal.fullName, sample.data.personal.fullName);
    assert.equal(validResult.state.data.story.heroStats.length, 3);
  }

  const invalidNull = validateAndNormalizeCvState(null);
  assert.equal(invalidNull.ok, false);

  const missingPersonal = validateAndNormalizeCvState({ version: 1, data: {} });
  assert.equal(missingPersonal.ok, false);

  // Backwards compatibility with payloads lacking `story`
  const v1Payload = validateAndNormalizeCvState({
    data: { personal: { fullName: 'Trần An' } },
    settings: { template: 'invalid-template', primaryColor: 'not-a-hex' },
  });
  assert.equal(v1Payload.ok, true);
  if (v1Payload.ok) {
    assert.equal(v1Payload.state.data.personal.fullName, 'Trần An');
    assert.equal(v1Payload.state.settings.template, 'modern');
    assert.equal(v1Payload.state.settings.primaryColor, '#0B1F3A');
    assert.ok(v1Payload.state.data.story.slogan.length > 0);
  }
});
