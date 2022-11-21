import { getSecondsDiff, formatDuration } from './Time';

test('get difference in seconds between two datetimes', () => {
  
  let date = new Date(),
  date1 = new Date( date.getTime() + 1000 ),
  date2 = new Date( date.getTime() + 2000 );

  expect( getSecondsDiff( date, date1 ) ).toBe( 1 );
  expect( getSecondsDiff( date, date2 ) ).toBe( 2 );
  
});

test('formatDuration should format song duration to MM:SS format', () => {
  
    let duration = 1000,
        duration1 = 60000,
        duration2 = 61000;
    
        expect(formatDuration(duration)).toBe("00:01");
        expect(formatDuration(duration1)).toBe("01:00");
        expect(formatDuration(duration2)).toBe("01:01");
  });
  