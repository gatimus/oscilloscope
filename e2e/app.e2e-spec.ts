import { OscilloscopePage } from './app.po';

describe('oscilloscope App', function() {
  let page: OscilloscopePage;

  beforeEach(() => {
    page = new OscilloscopePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
