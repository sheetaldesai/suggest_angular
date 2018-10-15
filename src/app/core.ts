export enum SuggestionType  {
    TABLE,
    COLUMN,
    KEYWORD
}

export enum SuggestionKeywords {
    SELECT = "select",
    CREATE = "create",
    UPDATE = "update",
    ALTER = "alter",
    INSERT = "insert",
    FROM = "from",
    WHERE = "where"
}

export class Suggestion {
    type: SuggestionType;
    snippet: string;

    constructor(type, snippet) {
      this.type = type;
      this.snippet = snippet;
    }
}