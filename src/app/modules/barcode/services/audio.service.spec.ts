import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

describe('AudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers:[NativeAudio]}));

  it('should be created', () => {
    const service: AudioService = TestBed.get(AudioService);
    expect(service).toBeTruthy();
  });
});
