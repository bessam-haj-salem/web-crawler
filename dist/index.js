"use strict";
class EmailCrawler {
    constructor() {
        this.visitedUrls = new Set();
    }
    getEmailsInPageAndChildPages(browser, url, maximumDepth) {
        this.visitedUrls.clear();
        return this.crawlPage(browser, url, maximumDepth);
    }
    crawlPage(browser, url, depth) {
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
        return Array.from(new Set(emails)); // Ensure distinct emails
    }
    extractEmails(html) {
        const emailRegex = /mailto:(\S+@\S+\.\S+)/g;
        return [...html.matchAll(emailRegex)].map(match => match[1]);
    }
    extractChildUrls(html) {
        const urlRegex = /href="(.+?)"/g;
        return [...html.matchAll(urlRegex)].map(match => match[1]);
    }
}
