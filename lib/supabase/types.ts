export type CaseStudy = {
    id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    featured: boolean;
    read_time: string | null;
    author: string | null;
    thumbnail: string | null;
    content: string;
    created_at: string;
    updated_at: string;
};

export type CaseStudyInsert = Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>;
export type CaseStudyUpdate = Partial<CaseStudyInsert>;

export type Database = {
    public: {
        Tables: {
            case_studies: {
                Row: CaseStudy;
                Insert: CaseStudyInsert;
                Update: CaseStudyUpdate;
            };
        };
    };
};
