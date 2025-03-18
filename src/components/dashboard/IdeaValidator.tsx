
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Check, X, Loader2, Brain } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';

interface ValidationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  marketPotential: number;
  innovation: number;
  feasibility: number;
  recommendation: string;
}

const IdeaValidator = () => {
  const [idea, setIdea] = useState('');
  const [description, setDescription] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async () => {
    if (!idea || !description) return;

    setIsValidating(true);
    setResult(null);

    // Simulating API call to validate idea
    setTimeout(() => {
      const mockResult: ValidationResult = {
        score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
        strengths: [
          'Innovative approach to the problem',
          'Large potential market size',
          'Clear value proposition',
        ],
        weaknesses: [
          'Competitive market landscape',
          'High initial development costs',
          'Complex regulatory requirements',
        ],
        marketPotential: Math.floor(Math.random() * 30) + 70,
        innovation: Math.floor(Math.random() * 40) + 60,
        feasibility: Math.floor(Math.random() * 50) + 50,
        recommendation:
          'Your idea shows strong potential but consider refining the execution strategy and conducting more market research to validate demand.',
      };

      setResult(mockResult);
      setIsValidating(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            AI Idea Validator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="idea-title" className="block text-sm font-medium mb-1">
                Startup Idea Title
              </label>
              <Input
                id="idea-title"
                placeholder="E.g., AI-Powered Personal Finance Assistant"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="idea-description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="idea-description"
                placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target audience? What is your business model?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px]"
              />
            </div>
            
            <Button 
              onClick={handleValidate} 
              disabled={!idea || !description || isValidating}
              className="w-full"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Your Idea...
                </>
              ) : (
                'Validate My Idea'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isValidating && (
        <Card className="animate-pulse-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto text-primary animate-pulse-soft mb-4" />
                <p className="text-lg font-medium">Our AI is analyzing your idea...</p>
                <p className="text-sm text-gray-500 mt-2">
                  We're checking market trends, competition, and business viability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-lg font-medium">Overall Score</h3>
                  <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </span>
                </div>
                <div className="w-full sm:w-2/3">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Market Potential</span>
                        <span className="text-sm font-medium">{result.marketPotential}%</span>
                      </div>
                      <Progress value={result.marketPotential} className={getProgressColor(result.marketPotential)} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Innovation</span>
                        <span className="text-sm font-medium">{result.innovation}%</span>
                      </div>
                      <Progress value={result.innovation} className={getProgressColor(result.innovation)} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Feasibility</span>
                        <span className="text-sm font-medium">{result.feasibility}%</span>
                      </div>
                      <Progress value={result.feasibility} className={getProgressColor(result.feasibility)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <X className="w-5 h-5 text-red-500 mr-2" />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <h3 className="text-lg font-medium mb-2">AI Recommendation</h3>
                <p className="text-gray-700">{result.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IdeaValidator;
