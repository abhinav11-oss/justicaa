import { useState } => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <category.icon className="h-4 w-4" />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Results */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No questions found matching your search criteria.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((faq) => {
            const isOpen = openFAQs.includes(faq.id);
            const categoryInfo = categories.find(c => c.id === faq.category);
            
            return (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted" onClick={() => toggleFAQ(faq.id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              {categoryInfo && <categoryInfo.icon className="h-3 w-3" />}
                              <span>{categoryInfo?.name}</span>
                            </Badge>
                            <div className="flex flex-wrap gap-1">
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {isOpen ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          <strong>Disclaimer:</strong> This information is for general guidance only. 
                          Laws vary by jurisdiction. Consult with a qualified attorney for advice specific to your situation.
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })
        )}
      </div>

      {/* Contact CTA */}
      <Card className="bg-primary/5">
        <CardContent className="text-center py-6">
          <h4 className="text-lg font-medium text-primary mb-2">Need Specific Legal Advice?</h4>
          <p className="text-primary-foreground/80 mb-4">Our knowledge base provides general information. For personalized legal counsel, connect with a qualified attorney.</p>
          <Button className="bg-primary hover:bg-primary/90">Find a Lawyer</Button>
        </CardContent>
      </Card>
    </div>
  );
};