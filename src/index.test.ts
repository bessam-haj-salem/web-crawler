import { EmailCrawler, IWebBrowser } from './index'; 

describe('EmailCrawler', () => {
  let crawler: EmailCrawler;
  let mockBrowser: jest.Mocked<IWebBrowser>;

  beforeEach(() => {
    mockBrowser = {
      getHtml: jest.fn(),
    };
    crawler = new EmailCrawler();
  });

  it('doit retourner une array vide si le depth est inférieur à 0', () => {
    const emails = crawler.getEmailsInPageAndChildPages(mockBrowser, 'http://test.com', -1);
    expect(emails).toEqual([]);
  });

  it('doit retourner une array vide si le navigateur retourne une URL null', () => {
    mockBrowser.getHtml.mockReturnValueOnce(null);
    const emails = crawler.getEmailsInPageAndChildPages(mockBrowser, 'http://test.com', 1);
    expect(emails).toEqual([]);
  });

  it('doit retournerles emails de la page courante si le depth est égal à 0', () => {
    const html = '<a href="mailto:test@example.com">test</a>';
    mockBrowser.getHtml.mockReturnValueOnce(html);
    const emails = crawler.getEmailsInPageAndChildPages(mockBrowser, 'http://test.com', 0);
    expect(emails).toEqual(['test@example.com']);
  });

  it('doit faire le crawl récursivement sur les page enfants', () => {
    mockBrowser.getHtml.mockReturnValueOnce('<a href="mailto:first@test.com"></a><a href="http://childpage.com">child</a>')
                     .mockReturnValueOnce('<a href="mailto:second@test.com"></a>');

    const emails = crawler.getEmailsInPageAndChildPages(mockBrowser, 'http://test.com', 1);
    expect(emails).toEqual(['first@test.com', 'second@test.com']);
  });

});
