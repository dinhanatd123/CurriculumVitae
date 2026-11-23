import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPdfDocumentTitle,
  computeAutoZoomScale,
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
  assert.equal(getContrastTextColor('#1E3A5F'), '#FFFFFF');
  assert.equal(getContrastTextColor('#0F5C5C'), '#FFFFFF');
  assert.equal(getContrastTextColor('#FDE047'), '#0F172A');
  assert.equal(getContrastTextColor('#E2E8F0'), '#0F172A');
});

test('validateAndNormalizeCvState validates valid payloads and rejects malformed JSON', () => {
  const sample = createSampleCvState();
  const validResult = validateAndNormalizeCvState(sample);
  assert.equal(validResult.ok, true);
  if (validResult.ok) {
    assert.equal(validResult.state.data.personal.fullName, sample.data.personal.fullName);
    assert.equal(validResult.state.settings.template, 'modern');
  }

  const invalidNull = validateAndNormalizeCvState(null);
  assert.equal(invalidNull.ok, false);

  const missingPersonal = validateAndNormalizeCvState({ version: 1, data: {} });
  assert.equal(missingPersonal.ok, false);

  const partial = validateAndNormalizeCvState({
    data: { personal: { fullName: 'Trần An' } },
    settings: { template: 'invalid-template', primaryColor: 'not-a-hex' },
  });
  assert.equal(partial.ok, true);
  if (partial.ok) {
    assert.equal(partial.state.data.personal.fullName, 'Trần An');
    assert.equal(partial.state.settings.template, 'modern');
    assert.equal(partial.state.settings.primaryColor, '#1E3A5F');
  }
});
