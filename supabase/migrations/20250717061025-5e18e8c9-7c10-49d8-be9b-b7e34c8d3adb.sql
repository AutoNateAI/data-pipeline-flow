-- Update existing workflow data and add new Data Analysis prompts

-- First, update any existing Grant Writing references to Data Analysis
UPDATE public.prompts 
SET title = REPLACE(title, 'Grant Writing', 'Data Analysis'),
    content = REPLACE(content, 'Grant Writing', 'Data Analysis'),
    description = REPLACE(description, 'Grant Writing', 'Data Analysis'),
    category = CASE WHEN category = 'Grant Writing' THEN 'Data Analysis' ELSE category END
WHERE title LIKE '%Grant Writing%' OR content LIKE '%Grant Writing%' OR category = 'Grant Writing';

UPDATE public.templates 
SET title = REPLACE(title, 'Grant Writing', 'Data Analysis'),
    content = REPLACE(content, 'Grant Writing', 'Data Analysis'),
    description = REPLACE(description, 'Grant Writing', 'Data Analysis'),
    category = CASE WHEN category = 'Grant Writing' THEN 'Data Analysis' ELSE category END
WHERE title LIKE '%Grant Writing%' OR content LIKE '%Grant Writing%' OR category = 'Grant Writing';

-- Update Grant AI references to Data Analysis AI
UPDATE public.prompts 
SET title = REPLACE(title, 'Grant AI', 'Data Analysis AI'),
    content = REPLACE(content, 'Grant AI', 'Data Analysis AI'),
    description = REPLACE(description, 'Grant AI', 'Data Analysis AI')
WHERE title LIKE '%Grant AI%' OR content LIKE '%Grant AI%';

-- Clear existing prompts to insert new Data Analysis workflow prompts
DELETE FROM public.prompts WHERE category = 'Data Analysis' OR category = 'Grant Writing';

-- Insert new Data Analysis workflow prompts
INSERT INTO public.prompts (title, content, description, category, tags, difficulty_level, estimated_time, is_featured) VALUES

-- Planning Phase Prompts
('Research Data Needs Assessment', 'I''m planning a research data pipeline for my project on [YOUR RESEARCH TOPIC]. 
Help me conduct a comprehensive data needs assessment by asking me targeted questions about:

1. The types of data I''ll be collecting/using (e.g., numerical, text, images, etc.)
2. Approximate data volumes and scale expectations
3. Data sources and formats (e.g., instruments, surveys, existing datasets)
4. Collection frequency and temporal aspects
5. Key variables and measurements of interest
6. Primary research questions the data needs to address
7. Intended analyses and statistical approaches
8. Collaboration requirements and team structure
9. Field-specific standards or requirements
10. Computing resources and technical constraints
11. Data security, privacy, and ethical considerations
12. Timeline and project duration

For each question, explain why it matters for pipeline design and suggest best practices relevant to my field of [YOUR FIELD].', 'Comprehensive assessment of data requirements for research pipeline planning', 'Data Analysis', ARRAY['planning', 'assessment', 'data-requirements'], 'Beginner', '30-45 minutes', true),

('Pipeline Architecture Design', 'Design a comprehensive research data pipeline architecture for my project with these characteristics:

Research field: [YOUR FIELD]
Data types: [LIST DATA TYPES]
Data volume: Approximately [ESTIMATE SIZE/RECORDS]
Team size: [NUMBER] researchers with [DESCRIBE TECHNICAL SKILLS]
Analysis goals: [DESCRIBE ANALYSIS PLANS]
Technical resources: [DESCRIBE AVAILABLE TECH/TOOLS]

The architecture should include:
1. Data collection and ingestion processes
2. Storage solutions appropriate for my resources
3. Processing and transformation workflows
4. Quality control and validation checkpoints
5. Analysis integration points
6. Output and visualization components
7. Documentation and metadata management
8. Archiving and sharing mechanisms

For each component:
- Explain its purpose and function
- Suggest appropriate tools considering my constraints
- Identify potential bottlenecks or challenges
- Recommend best practices specific to my field', 'Design optimal data pipeline architecture based on project requirements', 'Data Analysis', ARRAY['architecture', 'planning', 'pipeline-design'], 'Intermediate', '45-60 minutes', true),

-- Structure Phase Prompts
('Folder Structure Design', 'Design an optimal folder structure for my research data that follows best practices and supports reproducibility.

My research context:
- Field: [YOUR FIELD]
- Data types: [LIST DATA TYPES]
- Project duration: [TIMEFRAME]
- Team size: [NUMBER] researchers
- Analysis types: [LIST ANALYSIS TYPES]
- Sharing requirements: [DESCRIBE SHARING NEEDS]

Please provide:
1. A complete folder hierarchy with descriptive names
2. Clear separation of raw, processed, and output data
3. Logical organization for scripts, documentation, and metadata
4. Version control considerations
5. Naming conventions for both folders and files
6. Explanation of the rationale behind the structure
7. README templates for key directories
8. Recommendations for implementation and maintenance

Structure this for both human readability and computational efficiency.', 'Create organized folder structure for research data management', 'Data Analysis', ARRAY['organization', 'structure', 'best-practices'], 'Beginner', '20-30 minutes', false),

('Metadata Schema Development', 'Develop a comprehensive metadata schema for my research data on [TOPIC] that balances thoroughness with practicality.

My field is [YOUR FIELD] and my data includes:
[DESCRIBE YOUR DATA TYPES AND SOURCES]

Create a metadata framework that:
1. Includes essential elements for dataset identification, methodology documentation, variable descriptions, processing history, quality indicators, and usage rights
2. Follows relevant standards in my field
3. Uses machine-readable formats where appropriate
4. Scales efficiently for my data volume
5. Can be maintained throughout the research lifecycle
6. Supports future data sharing and preservation
7. Includes controlled vocabularies where beneficial

Provide specific metadata fields with descriptions, examples, and implementation guidance.', 'Develop structured metadata schema for research data documentation', 'Data Analysis', ARRAY['metadata', 'documentation', 'standards'], 'Intermediate', '45-60 minutes', false),

-- Cleaning Phase Prompts
('Data Cleaning Strategy', 'Develop a comprehensive data cleaning strategy for my research dataset on [TOPIC] that addresses common quality issues while preserving data integrity.

My dataset has these characteristics:
[DESCRIBE DATASET: size, types, known issues]

Design a cleaning workflow that addresses:
1. Missing value handling appropriate for my analysis plans
2. Outlier identification and treatment
3. Format standardization and harmonization
4. Error correction and validation
5. Deduplication methods
6. Consistency enforcement across related variables
7. Handling of special values or codes
8. Documentation of all cleaning actions

For each cleaning component:
- Provide rationale for the recommended approach
- Discuss trade-offs between different cleaning methods
- Suggest implementation approaches suitable for my skills
- Include quality checks to verify cleaning effectiveness
- Recommend documentation practices for reproducibility', 'Systematic approach to cleaning and improving data quality', 'Data Analysis', ARRAY['data-cleaning', 'quality-control', 'preprocessing'], 'Intermediate', '60-90 minutes', true),

('Missing Data Treatment', 'Help me develop a principled approach to missing data in my research dataset on [TOPIC].

My dataset has these missing data patterns:
[DESCRIBE MISSING DATA PATTERNS]

My analytical goals are:
[DESCRIBE ANALYSIS PLANS]

Please provide:
1. A framework for classifying missing data (MCAR, MAR, MNAR) in my context
2. Approaches to diagnose the mechanisms behind missing values
3. Appropriate handling methods for each variable type considering my analysis goals
4. Statistical considerations for each approach
5. Implementation guidance using [TOOLS/LANGUAGES]
6. Documentation requirements for transparent reporting
7. Sensitivity analysis recommendations
8. Warning signs that would indicate my missing data approach is inappropriate

Explain the rationale behind each recommendation and the potential impact on research conclusions.', 'Handle missing data with statistical rigor and transparency', 'Data Analysis', ARRAY['missing-data', 'statistical-methods', 'data-quality'], 'Advanced', '90-120 minutes', false),

-- Validation Phase Prompts
('Data Validation Framework', 'Create a comprehensive validation framework for my research data pipeline on [TOPIC] that ensures quality and reliability throughout the process.

My data characteristics:
[DESCRIBE DATA TYPES, VOLUME, AND KEY QUALITY CONCERNS]

Develop a multi-level validation approach that includes:
1. Input validation (raw data quality)
2. Process validation (transformation correctness)
3. Output validation (results integrity)
4. Business rule validation (domain-specific constraints)
5. Consistency validation (internal logical consistency)
6. Temporal validation (time-related integrity)
7. Relational validation (cross-variable relationships)

For each validation level:
- Define specific validation tests and criteria
- Establish acceptable thresholds and quality metrics
- Recommend implementation approaches
- Design reporting formats for validation results
- Suggest actions for different validation outcomes

Structure this as a formal validation protocol I can implement throughout my pipeline.', 'Comprehensive quality validation framework for data pipelines', 'Data Analysis', ARRAY['validation', 'quality-assurance', 'testing'], 'Advanced', '90-120 minutes', true),

('Statistical Distribution Checks', 'Develop statistical distribution checks for my research variables to identify potential data quality issues or interesting patterns.

My key variables include:
[LIST VARIABLES WITH TYPES AND EXPECTED DISTRIBUTIONS]

Create an analysis approach that:
1. Tests each variable against expected distributions
2. Identifies multi-modal patterns requiring investigation
3. Detects potential data quality issues manifesting as distribution anomalies
4. Compares distributions across different subgroups
5. Examines joint distributions between related variables
6. Tracks distribution changes over time or processing stages
7. Generates visual and statistical outputs for review

Provide implementation guidance suitable for my expertise with [TOOLS/LANGUAGES], and include interpretation guidelines for common distribution patterns and anomalies in my type of research data.', 'Statistical analysis to validate data distributions and detect anomalies', 'Data Analysis', ARRAY['statistics', 'distribution-analysis', 'anomaly-detection'], 'Advanced', '60-90 minutes', false),

-- Documentation Phase Prompts
('Pipeline Documentation Generator', 'Generate comprehensive documentation for my data pipeline on [TOPIC] that would enable reproducibility and knowledge transfer.

My pipeline includes these components:
[LIST KEY PIPELINE COMPONENTS AND PROCESSES]

Create documentation that includes:
1. Executive overview of the entire pipeline
2. Detailed architecture diagram description
3. Component-by-component technical specifications
4. Data flow documentation
5. Input and output specifications for each stage
6. Dependencies and environmental requirements
7. Configuration and parameter documentation
8. Error handling and recovery procedures
9. Monitoring and maintenance guidelines
10. Change management and version history processes

Format this documentation for both technical and non-technical audiences, with appropriate cross-referencing and a structure that supports both comprehensive understanding and quick reference.', 'Create comprehensive documentation for data pipeline reproducibility', 'Data Analysis', ARRAY['documentation', 'reproducibility', 'knowledge-transfer'], 'Intermediate', '60-90 minutes', false),

('Data Dictionary Generator', 'Based on this dataset:
[DESCRIBE DATASET OR UPLOAD SAMPLE]

Generate a comprehensive data dictionary that includes for each variable:
1. Variable name (as it appears in the data)
2. Human-readable label
3. Detailed description of what the variable represents
4. Data type and format specification
5. Units of measurement
6. Allowed values or valid range
7. Coding information for categorical variables
8. Treatment of missing values
9. Derivation logic (for calculated fields)
10. Relationships to other variables
11. Source information
12. Usage notes or caveats

Format this as a structured data dictionary suitable for both human reference and machine readability, following best practices in [YOUR FIELD].', 'Generate structured data dictionary for dataset variables', 'Data Analysis', ARRAY['data-dictionary', 'documentation', 'metadata'], 'Beginner', '30-45 minutes', false);

-- Insert Data Analysis templates
INSERT INTO public.templates (title, content, description, category, type, file_type, tags) VALUES

('Cloud Data Pipeline Builder Guide', '# Cloud Data Pipeline Builder

## Turn Data Chaos Into Order: Build a Cloud-Ready AI-Augmented Research Data Pipeline

**Price: $129**

Are you struggling with messy research data and inconsistent workflows? This AI-augmented workflow transforms how researchers organize, clean, and manage their data, turning chaos into streamlined, reproducible pipelines.

### What You''ll Get

- **Complete Data Pipeline Workflow Guide** (PDF): Step-by-step process for building structured data workflows with AI assistance
- **AI Prompt Pack** (CSV/TXT): 30+ expertly crafted prompts for data structuring, cleaning, validation, and documentation
- **Editable Templates** (Notion/Markdown): Data pipeline structures, metadata frameworks, and documentation templates
- **Bonus Video Walkthrough**: See the workflow in action with a real research dataset

### Why Researchers Love This

- Create reproducible data workflows that meet FAIR principles
- Clean and structure messy data without coding expertise
- Generate comprehensive data documentation automatically
- Improve collaboration with clear data organization
- Perfect for lab teams, multi-site projects, and researchers handling complex datasets

### Works With
- Windsurf
- NotebookLM
- ChatGPT
- Claude
- Common cloud storage systems (guidance included)

*"This workflow transformed our lab''s data management. What used to take days now happens automatically, and our reproducibility has improved dramatically." - Research Director, Biomedical Sciences*', 'Complete guide for building AI-augmented research data pipelines', 'Data Analysis', 'Guide', 'PDF', ARRAY['data-pipeline', 'workflow', 'ai-tools']),

('Data Pipeline Workflow Template', '# Data Pipeline Workflow

## Phase 1: Planning
- Research data assessment
- Pipeline architecture design
- Technology stack selection

## Phase 2: Structure
- Folder organization
- Metadata schema
- Documentation framework

## Phase 3: Ingestion
- Data collection protocols
- Automated ingestion
- Initial validation

## Phase 4: Cleaning
- Quality assessment
- Missing data handling
- Outlier management

## Phase 5: Transformation
- Data formatting
- Feature engineering
- Integration processes

## Phase 6: Validation
- Quality metrics
- Statistical checks
- Process validation

## Phase 7: Documentation
- Pipeline documentation
- Data dictionaries
- Usage guides

## Phase 8: Sharing
- Repository preparation
- Collaboration setup
- Publication planning', 'Template workflow for systematic data pipeline development', 'Data Analysis', 'Template', 'Markdown', ARRAY['workflow', 'template', 'data-management']);

-- Update user_workflows to reflect Data Analysis AI instead of Grant AI
UPDATE public.user_workflows 
SET workflow_data = jsonb_set(
    workflow_data,
    '{title}',
    '"Data Analysis AI Workflow"'::jsonb
) WHERE workflow_data->>'title' LIKE '%Grant%';