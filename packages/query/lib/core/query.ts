interface Query {
  filterText?: string;
  fuzzy?: boolean;
  order?: string[];
  limit?: number;
  offset?: number;
}
