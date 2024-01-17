type Url = string;

interface Project {
    id: string;
    name: string;
    author: string;
    domainUrl: string;
    figmaToken: string;
    pages: Record<Url, Page>;
}
