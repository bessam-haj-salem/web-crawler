
export interface IWebBrowser {
  getHtml(url: string): string | null;
}

interface IAmTheTest {
  getEmailsInPageAndChildPages(browser: IWebBrowser, url: string, maximumDepth: number): string[];
}



export class EmailCrawler implements IAmTheTest {
  private visitedUrls: Set<string> = new Set();

  getEmailsInPageAndChildPages(browser: IWebBrowser, url: string, maximumDepth: number): string[] {
      this.visitedUrls.clear();
      return this.crawlPage(browser, url, maximumDepth);
  }

  private crawlPage(browser: IWebBrowser, url: string, depth: number): string[] {
      if (depth < 0 || this.visitedUrls.has(url)) {
          return [];
      }

      this.visitedUrls.add(url);
      const html = browser.getHtml(url);
      if (!html) {
          return [];
      }

      const emails = this.extractEmails(html);
      if (depth === 0) {
          return emails;
      }

      const childUrls = this.extractChildUrls(html);
     
      for (const childUrl of childUrls) {
          emails.push(...this.crawlPage(browser, childUrl, depth - 1));
      }

      return Array.from(new Set(emails)); // s'assurer qu'il n'y a pas de doublons
  }

  private extractEmails(html: string): string[] {
      const emailRegex = /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      return [...html.matchAll(emailRegex)].map(match => match[1]);
  }

  private extractChildUrls(html: string): string[] {
      const urlRegex = /href="(.+?)"/g;
      return [...html.matchAll(urlRegex)].map(match => match[1]);
  }
}
