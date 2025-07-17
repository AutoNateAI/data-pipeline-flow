import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Copy, CheckCircle, Circle, ArrowRight, Lightbulb, FileText, Clock, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  phase: string;
  estimatedTime: string;
  isCompleted: boolean;
  prompts?: string[];
  templates?: string[];
  content?: string;
  tips?: string[];
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "1",
    title: "1. Planning Phase",
    description: "Research Data Assessment and Pipeline Architecture Planning",
    phase: "Planning",
    estimatedTime: "2-3 hours",
    isCompleted: false,
    content: `
## Planning Your Research Data Pipeline

This phase establishes the foundation for robust, reproducible data workflows. Take time to:

• Assess your data types, volumes, and sources
• Design appropriate pipeline architecture
• Identify necessary tools and technologies
• Plan for quality control checkpoints
• Consider collaboration requirements
• Establish data security and privacy protocols

Proper planning prevents data chaos and ensures FAIR principles (Findable, Accessible, Interoperable, Reusable).

**Use this prompt:**

I need to create a research data pipeline for my project on [YOUR RESEARCH TOPIC]. 
Help me assess my data needs by asking me key questions about:

1. The types of data I'll be collecting/using (e.g., numerical, text, images, etc.)
2. Approximate data volumes (records, file sizes)
3. Data sources and formats (e.g., instruments, surveys, existing datasets)
4. Frequency of data collection/updates
5. Key variables or data points of interest
6. Intended analyses and outputs
7. Collaboration requirements (who needs access and when)
8. Any field-specific standards I should follow
9. Computing resources available to me
10. Data security or privacy requirements

For each question, explain why it's important for planning my pipeline.
    `,
    tips: [
      "Start small with one data source before expanding to multiple sources",
      "Design with reproducibility in mind from the beginning",
      "Consider future scalability when selecting tools and approaches"
    ]
  },
  {
    id: "2",
    title: "2. Structure Phase",
    description: "Folder Structure Creation and Metadata Schema Development",
    phase: "Structure",
    estimatedTime: "3-4 hours",
    isCompleted: false,
    content: `
## Structuring Your Data Pipeline

Create organized, standardized structures that support reproducible research:

Key components to establish:
• Logical folder hierarchies for data and documentation
• Consistent naming conventions across the pipeline
• Comprehensive metadata schemas
• Version control considerations
• Documentation templates for each major component

Well-structured data foundations make collaboration seamless and ensure long-term accessibility.

**Use this prompt:**

Help me create a comprehensive folder structure for my research data pipeline with these characteristics:

Research field: [YOUR FIELD]
Data types: [LIST DATA TYPES]
Project duration: [TIMEFRAME]
Team size: [NUMBER] researchers
Analysis types: [LIST ANALYSIS TYPES]

Include folders for:
1. Raw data (with appropriate substructures)
2. Processed data (with version control considerations)
3. Analysis scripts and outputs
4. Documentation
5. Metadata
6. Results and visualizations
7. Any field-specific requirements

For each main folder, explain:
- Its purpose
- Naming conventions to follow
- What belongs (and doesn't belong) there
- Any special considerations for that data type

Also, suggest a README template for each key folder.
    `,
    tips: [
      "Use descriptive, self-documenting folder and file names",
      "Separate raw data from processed data to preserve originals",
      "Create metadata schemas before collecting data, not after"
    ]
  },
  {
    id: "3",
    title: "3. Ingestion Phase",
    description: "Data Collection Protocol and Automated Data Ingestion",
    phase: "Ingestion",
    estimatedTime: "4-5 hours",
    isCompleted: false,
    content: `
## Setting Up Data Ingestion

Establish consistent, reliable processes for bringing data into your pipeline:

• **Standardized collection protocols** - Ensure consistency across sources
• **Automated ingestion processes** - Reduce manual errors and save time
• **Initial quality screening** - Catch issues early in the pipeline
• **Data preservation** - Maintain raw data integrity
• **Comprehensive logging** - Track all ingestion activities

Robust ingestion processes are the foundation of reliable data pipelines.

**Use this prompt:**

Create a detailed data collection protocol for my research on [TOPIC] that ensures consistency and quality.

My data sources include:
[LIST YOUR DATA SOURCES]

For this protocol, include:
1. Step-by-step procedures for each data source
2. Required equipment/software configurations
3. Calibration or setup procedures
4. Sampling methods and frequencies
5. Data capture forms or templates
6. Quality checks during collection
7. Backup procedures during collection
8. Troubleshooting common issues
9. Documentation requirements during collection
10. Handling of edge cases or unexpected scenarios

Format this as a clear standard operating procedure that team members can follow precisely.
    `,
    tips: [
      "Test ingestion processes with sample data before full implementation",
      "Always preserve original raw data in unmodified form",
      "Build in validation checks at the point of data entry"
    ]
  },
  {
    id: "4",
    title: "4. Cleaning Phase",
    description: "Data Cleaning Strategy and AI-Powered Data Processing",
    phase: "Cleaning",
    estimatedTime: "5-6 hours",
    isCompleted: false,
    content: `
## Data Cleaning and Quality Assurance

Transform messy, inconsistent data into analysis-ready datasets:

• **Quality assessment** - Identify missing values, outliers, and inconsistencies
• **Standardization** - Harmonize formats, units, and coding schemes
• **Error correction** - Address data entry errors and anomalies
• **Documentation** - Record all cleaning decisions for reproducibility
• **Validation** - Verify cleaning effectiveness with quality reports

AI-assisted cleaning can automate routine tasks while preserving data integrity.

**Use this prompt:**

Based on these common issues in my research data:
[LIST DATA QUALITY ISSUES]

Help me develop a comprehensive data cleaning strategy that:
1. Addresses missing values appropriately for my analysis needs
2. Detects and handles outliers using statistically sound methods
3. Standardizes formats and units consistently
4. Corrects common errors and inconsistencies
5. Validates data against expected ranges and relationships
6. Documents all cleaning actions for reproducibility
7. Preserves raw data while creating cleaned versions
8. Generates quality reports before and after cleaning

For each cleaning action, provide:
- The rationale for the approach
- Potential impacts on analysis
- Implementation guidance
- Documentation requirements
    `,
    tips: [
      "Always preserve original raw data before any cleaning operations",
      "Document all cleaning decisions and their rationale",
      "Validate cleaned data against expected distributions and relationships"
    ]
  },
  {
    id: "5",
    title: "5. Transformation Phase",
    description: "Data Transformation Planning and AI-Assisted Implementation",
    phase: "Transformation",
    estimatedTime: "4-5 hours",
    isCompleted: false,
    content: `
## Data Transformation and Feature Engineering

Convert cleaned data into analysis-ready formats optimized for your research goals:

• **Reshaping and restructuring** - Convert between wide and long formats
• **Feature engineering** - Create meaningful derived variables
• **Aggregation and summarization** - Combine data at appropriate levels
• **Normalization and standardization** - Prepare for statistical analysis
• **Integration** - Merge multiple datasets coherently

Well-planned transformations enhance analytical power while maintaining data integrity.

**Use this prompt:**

For my research project analyzing [TOPIC], I need to transform my cleaned data into analysis-ready formats.

My raw data structure is:
[DESCRIBE CURRENT DATA STRUCTURE]

I need final data structures for:
[DESCRIBE NEEDED OUTPUT FORMATS]

Help me plan appropriate transformations including:
1. Reshaping data (wide-to-long, long-to-wide, etc.)
2. Feature engineering needs
3. Aggregation or summarization steps
4. Joining or merging multiple datasets
5. Categorization or binning of variables
6. Normalization or standardization requirements
7. Creation of derived variables
8. Appropriate sequence of transformations
9. Version control approach for transformed datasets

For each transformation, explain the rationale and potential impacts on analysis.
    `,
    tips: [
      "Plan transformation sequences carefully to avoid data loss",
      "Test transformations on sample data before applying to full datasets",
      "Version control both code and transformed datasets"
    ]
  },
  {
    id: "6",
    title: "6. Validation Phase",
    description: "Data Validation Framework and Automated Quality Reports",
    phase: "Validation",
    estimatedTime: "3-4 hours",
    isCompleted: false,
    content: `
## Data Validation and Quality Assurance

Establish comprehensive validation to ensure data reliability and fitness for analysis:

• **Multi-level validation** - Input, process, and output checks
• **Quality metrics** - Quantitative measures of data integrity
• **Automated reporting** - Regular quality assessments
• **Threshold management** - Acceptable quality criteria
• **Issue flagging** - Early detection of problems

Robust validation frameworks prevent downstream analytical errors and ensure research integrity.

**Use this prompt:**

Help me develop a thorough validation framework for my research data pipeline that:

1. Defines quality criteria specific to my research question:
   [BRIEFLY DESCRIBE RESEARCH QUESTION]

2. Includes checks for:
   - Completeness (missing data detection)
   - Accuracy (error detection)
   - Consistency (internal logic validation)
   - Conformity (format and standard compliance)
   - Uniqueness (duplicate detection)
   - Integrity (relationship validation)
   - Timeliness (temporal validity)

3. Establishes acceptable thresholds for each criterion
4. Creates a scoring system for data quality
5. Defines actions for different validation outcomes
6. Incorporates both automated and manual validation components
7. Generates validation reports for documentation

Please structure this as a formal validation protocol I can implement.
    `,
    tips: [
      "Implement validation at multiple pipeline stages, not just at the end",
      "Create both automated and manual validation processes",
      "Track quality metrics over time to identify trends"
    ]
  },
  {
    id: "7",
    title: "7. Documentation Phase",
    description: "Comprehensive Pipeline Documentation and Data Dictionary Creation",
    phase: "Documentation",
    estimatedTime: "4-5 hours",
    isCompleted: false,
    content: `
## Documentation and Knowledge Management

Create comprehensive documentation that enables reproducibility and knowledge transfer:

• **Pipeline documentation** - Architecture and component descriptions
• **Data dictionaries** - Detailed variable and dataset documentation
• **Processing logs** - Complete transformation history
• **Usage guides** - Instructions for team members and future users
• **Standards compliance** - Alignment with field-specific requirements

Well-documented pipelines are essential for collaboration, reproducibility, and long-term maintenance.

**Use this prompt:**

Help me create comprehensive documentation for my research data pipeline that would enable another researcher to understand and reproduce my workflow.

My pipeline includes:
[SUMMARIZE KEY PIPELINE COMPONENTS]

The documentation should include:
1. Pipeline overview with visual representation
2. Detailed descriptions of each component and its purpose
3. Data dictionaries for all datasets
4. Processing logs and transformation records
5. Quality assurance procedures and results
6. Technical specifications and dependencies
7. Known limitations or issues
8. Usage instructions for team members
9. References to relevant standards or methods
10. Version history and change management

Format this documentation to be both human-readable and machine-actionable where possible.
    `,
    tips: [
      "Document as you build, not after completion",
      "Use version control for documentation as well as code",
      "Create documentation that serves both current users and future maintainers"
    ]
  },
  {
    id: "8",
    title: "8. Sharing Phase",
    description: "Data Publication Planning and Collaboration Workflow Design",
    phase: "Sharing",
    estimatedTime: "3-4 hours",
    isCompleted: false,
    content: `
## Data Sharing and Collaboration

Prepare your data pipeline for effective sharing and collaborative use:

• **Repository selection** - Choose appropriate platforms for your data
• **Access controls** - Manage permissions and usage rights
• **Publication preparation** - Format data for long-term accessibility
• **Collaboration workflows** - Enable team-based data management
• **Version management** - Track changes and updates systematically

Effective sharing maximizes research impact and enables reproducible science.

**Use this prompt:**

Help me plan for effective sharing of my research data on [TOPIC] by:

1. Identifying appropriate data repositories for [FIELD]
2. Outlining preparation steps needed before sharing
3. Recommending suitable file formats for long-term access
4. Drafting clear data usage guidelines and restrictions
5. Creating appropriate attribution and citation information
6. Suggesting necessary documentation for external users
7. Addressing any anonymization or privacy requirements
8. Considering embargo periods or access controls needed
9. Planning for version updates or corrections
10. Preparing metadata for repository submission

Consider that my sharing goals include [DESCRIBE GOALS] and my constraints include [DESCRIBE CONSTRAINTS].
    `,
    tips: [
      "Plan for data sharing from the beginning, not as an afterthought",
      "Choose repositories that align with your field's standards",
      "Design collaboration workflows that scale with team growth"
    ]
  }
];

interface WorkflowBuilderProps {
  workflowId?: string | null;
}

export function WorkflowBuilder({ workflowId }: WorkflowBuilderProps = {}) {
  const [steps, setSteps] = useState<WorkflowStep[]>(workflowSteps);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [workflowData, setWorkflowData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
    fetchTemplates();
    if (workflowId) {
      fetchWorkflowData();
    } else {
      loadUserProgress();
    }
  }, [workflowId]);

  const fetchWorkflowData = async () => {
    if (!workflowId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (error) throw error;
      
      if (data) {
        setWorkflowData(data.workflow_data);
        const currentStep = (data.workflow_data as any)?.current_step || 1;
        const stepsCompleted = (data.workflow_data as any)?.steps_completed || [];
        
        setSteps(prev => prev.map(step => ({
          ...step,
          isCompleted: stepsCompleted.includes(step.id)
        })));
      }
    } catch (error) {
      console.error('Error fetching workflow:', error);
    }
  };

  const updateWorkflowProgress = async (stepId: string, completed: boolean) => {
    if (!workflowId) return;

    try {
      const currentCompleted = steps.filter(s => s.isCompleted).map(s => s.id);
      const updatedCompleted = completed 
        ? [...currentCompleted, stepId].filter((s, i, arr) => arr.indexOf(s) === i)
        : currentCompleted.filter(s => s !== stepId);

      const updatedData = {
        ...workflowData,
        steps_completed: updatedCompleted,
        progress: Math.round((updatedCompleted.length / steps.length) * 100)
      };

      const { error } = await supabase
        .from('user_workflows')
        .update({ workflow_data: updatedData })
        .eq('id', workflowId);

      if (error) throw error;

      setWorkflowData(updatedData);
    } catch (error) {
      console.error('Error updating workflow progress:', error);
    }
  };

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('id, title, content, category');
      
      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('id, title, content, category');
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_workflows')
        .select('workflow_data')
        .eq('user_id', user.id)
        .single();

      if (data?.workflow_data) {
        const workflowData = data.workflow_data as any;
        setSteps(prev => prev.map(step => ({
          ...step,
          isCompleted: workflowData[step.id] || false
        })));
      }
    } catch (error) {
      // No existing workflow data
    }
  };

  const saveUserProgress = async (updatedSteps: WorkflowStep[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const workflowData = updatedSteps.reduce((acc, step) => ({
        ...acc,
        [step.id]: step.isCompleted
      }), {});

      await supabase
        .from('user_workflows')
        .upsert({
          user_id: user.id,
          workflow_data: workflowData
        });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const toggleStepCompletion = async (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    const newCompleted = !step?.isCompleted;
    
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, isCompleted: newCompleted } : step
    );
    setSteps(updatedSteps);
    
    if (workflowId) {
      updateWorkflowProgress(stepId, newCompleted);
    } else {
      saveUserProgress(updatedSteps);
    }

    // Track step completion in user_interactions if step is being completed
    if (newCompleted) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('🔄 Attempting to track workflow step completion:', stepId, 'for user:', user?.id);
        
        if (user) {
          // Prepare the interaction data with workflow context
          const interactionData = {
            user_id: user.id,
            interaction_type: 'workflow_step_completed',
            item_type: 'workflow_step',
            item_id: stepId
          };

          // If we have a workflow context, we could store additional metadata
          // For now, we'll rely on the step ID and get workflow info from current session
          const result = await supabase
            .from('user_interactions')
            .insert(interactionData);
          
          console.log('✅ Workflow step completion tracked successfully:', stepId, result);
        } else {
          console.error('❌ No user found when trying to track workflow step');
        }
      } catch (error) {
        console.error('❌ Error tracking workflow step completion:', error);
      }
    }
    
    toast({
      title: newCompleted ? "Step completed!" : "Step marked incomplete",
      description: newCompleted ? "Great progress on your data pipeline!" : "Step marked as incomplete.",
    });
  };

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const copyPromptContent = async (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (!prompt) return;

    await navigator.clipboard.writeText(prompt.content);
    toast({
      title: "Prompt copied!",
      description: `"${prompt.title}" copied to clipboard.`,
    });
  };

  const groupedSteps = steps.reduce((acc, step) => {
    if (!acc[step.phase]) {
      acc[step.phase] = [];
    }
    acc[step.phase].push(step);
    return acc;
  }, {} as Record<string, WorkflowStep[]>);

  const completedSteps = steps.filter(step => step.isCompleted).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  const getPromptsByIds = (promptIds?: string[]) => {
    if (!promptIds) return [];
    return prompts.filter(p => promptIds.some(id => 
      p.title.toLowerCase().includes(id) || p.category.toLowerCase().includes(id)
    ));
  };

  const getTemplatesByIds = (templateIds?: string[]) => {
    if (!templateIds) return [];
    return templates.filter(t => templateIds.some(id => 
      t.title.toLowerCase().includes(id) || t.category.toLowerCase().includes(id)
    ));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Data Analysis Workflow</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Follow this comprehensive AI-assisted workflow to build robust, reproducible data pipelines for your research. 
          Transform chaotic data practices into structured, efficient workflows.
        </p>
        {workflowData && (
          <div className="mt-6 p-4 bg-muted rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-lg">{workflowData.title}</h3>
            <p className="text-sm text-muted-foreground">
              {workflowData.funding_agency} • {workflowData.amount} • Due: {new Date(workflowData.deadline).toLocaleDateString()}
            </p>
            {workflowData.description && (
              <p className="text-sm text-muted-foreground mt-2">{workflowData.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Progress</h2>
          <Badge variant="outline" className="bg-primary/20 text-primary">
            {completedSteps} of {totalSteps} steps
          </Badge>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {progress.toFixed(0)}% complete - Keep up the great work!
        </p>
      </Card>

      {/* Workflow Steps by Phase */}
      {Object.entries(groupedSteps).map(([phase, phaseSteps]) => (
        <div key={phase} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary-glow"></div>
            <h2 className="text-2xl font-bold">{phase} Phase</h2>
          </div>

          <div className="space-y-4">
            {phaseSteps.map((step, index) => (
              <Card key={step.id} className="glass-card overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleStepExpansion(step.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepCompletion(step.id);
                        }}
                        className="mt-1 p-0 h-6 w-6"
                      >
                        {step.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-semibold ${step.isCompleted ? 'text-green-400' : 'text-foreground'}`}>
                            {step.title}
                          </h3>
                          <Badge variant="outline" className="bg-white/5">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.estimatedTime}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                        
                        {(step.prompts || step.templates) && (
                          <div className="flex gap-2 mt-3">
                            {step.prompts && (
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                <Lightbulb className="w-3 h-3 mr-1" />
                                {step.prompts.length} Prompt{step.prompts.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                            {step.templates && (
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                                <FileText className="w-3 h-3 mr-1" />
                                {step.templates.length} Template{step.templates.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="ml-4">
                      {expandedSteps.has(step.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedSteps.has(step.id) && (
                  <div className="border-t border-white/10 p-6 bg-black/20">
                    {step.content && (
                      <div className="mb-6 space-y-6">
                        {(() => {
                          const parts = step.content.split('**Use this prompt:**');
                          const beforePrompt = parts[0];
                          const promptContent = parts[1];

                          return (
                            <>
                              {/* Step Details Section */}
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  Step Details
                                </h4>
                                <div className="prose prose-invert max-w-none">
                                  {beforePrompt.split('\n').map((line, i) => {
                                    if (line.startsWith('•')) {
                                      return (
                                        <div key={i} className="flex items-start gap-2 mb-2">
                                          <div className="w-1 h-1 rounded-full bg-accent mt-2"></div>
                                          <span className="text-muted-foreground">{line.substring(1).trim()}</span>
                                        </div>
                                      );
                                    }
                                    return line.trim() ? (
                                      <p key={i} className="mb-3 text-muted-foreground">{line}</p>
                                    ) : null;
                                  })}
                                </div>
                              </div>

                              {/* Prompt Section */}
                              {promptContent && (
                                <div>
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Copy className="w-4 h-4 text-accent" />
                                    📝 Use this prompt:
                                  </h4>
                                  <div className="glass-card p-4 bg-black/20 rounded-lg border-l-4 border-accent">
                                    <pre className="whitespace-pre-wrap text-sm font-mono text-green-400 leading-relaxed">
                                      {promptContent.trim()}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {step.tips && step.tips.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">💡 Pro Tips</h4>
                        <ul className="space-y-2">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                              <span className="text-sm text-muted-foreground">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.prompts && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Related Prompts
                        </h4>
                        <div className="space-y-3">
                          {getPromptsByIds(step.prompts).map((prompt) => (
                            <div key={prompt.id} className="glass-card p-4 bg-blue-500/10 border-blue-500/20">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-blue-400 mb-1">{prompt.title}</h5>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {prompt.content.substring(0, 150)}...
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyPromptContent(prompt.id)}
                                  className="ml-3 glass-button"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.templates && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Related Templates
                        </h4>
                        <div className="space-y-3">
                          {getTemplatesByIds(step.templates).map((template) => (
                            <div key={template.id} className="glass-card p-4 bg-purple-500/10 border-purple-500/20">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-purple-400 mb-1">{template.title}</h5>
                                  <p className="text-xs text-muted-foreground">
                                    {template.category} template
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-3 glass-button"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Completion Summary */}
      {completedSteps === totalSteps && (
        <Card className="glass-card p-8 text-center bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">Workflow Complete!</h2>
          <p className="text-muted-foreground">
            Congratulations! You've completed all steps in the Data Analysis Workflow. 
            Your data pipeline is now ready for analysis and sharing.
          </p>
        </Card>
      )}
    </div>
  );
}