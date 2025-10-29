import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, X, Plus, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AITextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: Array<{ title: string; description?: string; category?: string }>;
  onSuggestionSelect: (suggestion: any) => void;
  loading?: boolean;
  className?: string;
  label?: string;
}

export const AITextInput: React.FC<AITextInputProps> = ({
  value,
  onChange,
  placeholder,
  suggestions,
  onSuggestionSelect,
  loading = false,
  className,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSuggestionSelect(suggestions[selectedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative" ref={listRef}>
      {label && (
        <label className="text-sm font-medium text-foreground mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("pr-10", className)}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                  selectedIndex === index && "bg-muted"
                )}
                onClick={() => {
                  onSuggestionSelect(suggestion);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{suggestion.title}</div>
                  {suggestion.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {suggestion.description}
                    </div>
                  )}
                  {suggestion.category && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {suggestion.category}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface AILocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: any) => void;
  placeholder?: string;
  suggestions: Array<{ place_id: string; description: string; formatted_address: string }>;
  loading?: boolean;
  className?: string;
  label?: string;
}

export const AILocationInput: React.FC<AILocationInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter location...",
  suggestions,
  loading = false,
  className,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onLocationSelect(suggestions[selectedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative" ref={listRef}>
      {label && (
        <label className="text-sm font-medium text-foreground mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("pr-10", className)}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                  selectedIndex === index && "bg-muted"
                )}
                onClick={() => {
                  onLocationSelect(suggestion);
                  setIsOpen(false);
                }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {suggestion.description}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {suggestion.formatted_address}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface AISkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  suggestions: Array<{ skill: string; category: string; relevance: number }>;
  onSuggestionSelect: (skill: string) => void;
  onInputChange?: (query: string) => void;
  loading?: boolean;
  className?: string;
  label?: string;
}

export const AISkillsInput: React.FC<AISkillsInputProps> = ({
  value,
  onChange,
  suggestions,
  onSuggestionSelect,
  onInputChange,
  loading = false,
  className,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [newSkill, setNewSkill] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSkill = (skill: string) => {
    if (skill.trim() && !value.includes(skill.trim())) {
      onChange([...value, skill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          addSkill(suggestions[selectedIndex].skill);
          setIsOpen(false);
        } else if (newSkill.trim()) {
          addSkill(newSkill);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative" ref={listRef}>
      {label && (
        <label className="text-sm font-medium text-foreground mb-2 block">
          {label}
        </label>
      )}
      
      {/* Selected Skills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={newSkill}
          onChange={(e) => {
            setNewSkill(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
            onInputChange?.(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill..."
          className={cn("pr-20", className)}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {!loading && (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              if (newSkill.trim()) {
                addSkill(newSkill);
              }
            }}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.skill}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                  selectedIndex === index && "bg-muted"
                )}
                onClick={() => {
                  addSkill(suggestion.skill);
                  setIsOpen(false);
                }}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{suggestion.skill}</div>
                  <div className="text-xs text-muted-foreground">
                    {suggestion.category} • {(suggestion.relevance * 100).toFixed(0)}% match
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {suggestion.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
