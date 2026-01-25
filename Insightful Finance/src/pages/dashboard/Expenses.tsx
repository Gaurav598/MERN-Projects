import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockExpenses, categories, formatCurrency, getCategoryById } from "@/data/mockData";
import { Search, Filter, Trash2, Edit2, MoreVertical, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredExpenses = mockExpenses
    .filter((expense) => {
      const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "amount") return b.amount - a.amount;
      return 0;
    });

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Expenses</h2>
          <p className="text-muted-foreground">
            {filteredExpenses.length} expenses • Total: {formatCurrency(totalFiltered)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card variant="default">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest First</SelectItem>
                <SelectItem value="amount">Highest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card variant="default">
        <CardHeader className="border-b border-border">
          <div className="hidden md:grid grid-cols-12 gap-4 text-sm text-muted-foreground font-medium">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No expenses found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredExpenses.map((expense, index) => {
                const category = getCategoryById(expense.category);
                return (
                  <div
                    key={expense.id}
                    className="p-4 hover:bg-muted/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Description */}
                      <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                          {category?.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{expense.description}</p>
                          <p className="text-sm text-muted-foreground md:hidden">
                            {category?.name} • {expense.date}
                          </p>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="hidden md:block col-span-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                          {category?.icon} {category?.name.split(" ")[0]}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="hidden md:flex col-span-2 items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        {expense.date}
                      </div>

                      {/* Amount */}
                      <div className="col-span-8 md:col-span-2 text-right">
                        <span className="text-lg font-semibold text-destructive">
                          -{formatCurrency(expense.amount)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-4 md:col-span-1 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
