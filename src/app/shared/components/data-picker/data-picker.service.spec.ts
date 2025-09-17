import { TestBed } from '@angular/core/testing';

import { DataPickerService } from './data-picker.service';

describe('DataPickerService', () => {
  let service: DataPickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataPickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
