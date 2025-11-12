import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  getRules,
  createRule,
  updateRule,
  deleteRule,
  type Rule,
} from "@/lib/api";

const RulesTab = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    valueType: "boolean" as "boolean" | "number",
    boolValue: true,
    numValue: 0,
    description: "",
  });

  // Fetch data
  const { data: rules, isLoading } = useQuery({
    queryKey: ["rules"],
    queryFn: getRules,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule created successfully");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create rule");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Rule> }) =>
      updateRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule updated successfully");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update rule");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete rule");
    },
  });

  const handleOpenDialog = (rule?: Rule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        key: rule.key,
        valueType: typeof rule.value === "boolean" ? "boolean" : "number",
        boolValue: typeof rule.value === "boolean" ? rule.value : true,
        numValue: typeof rule.value === "number" ? rule.value : 0,
        description: rule.description || "",
      });
    } else {
      setEditingRule(null);
      setFormData({
        key: "",
        valueType: "boolean",
        boolValue: true,
        numValue: 0,
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRule(null);
    setFormData({
      key: "",
      valueType: "boolean",
      boolValue: true,
      numValue: 0,
      description: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.key) {
      toast.error("Please enter a rule key");
      return;
    }

    if (formData.valueType === "number" && formData.numValue < 0) {
      toast.error("Number values must be >= 0");
      return;
    }

    const ruleData = {
      key: formData.key,
      value:
        formData.valueType === "boolean" ? formData.boolValue : formData.numValue,
      description: formData.description || undefined,
    };

    if (editingRule) {
      updateMutation.mutate({ id: editingRule._id, data: ruleData });
    } else {
      createMutation.mutate(ruleData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Business Rules</h2>
          <p className="text-sm text-muted-foreground">
            Define business rules that merchants can configure
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Rule
        </Button>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5 border-white/10">
              <TableHead className="text-foreground">Rule Key</TableHead>
              <TableHead className="text-foreground">Default Value</TableHead>
              <TableHead className="text-foreground">Type</TableHead>
              <TableHead className="text-foreground">Description</TableHead>
              <TableHead className="text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No rules found. Create your first rule to get started.
                </TableCell>
              </TableRow>
            ) : (
              rules?.map((rule) => (
                <TableRow key={rule._id} className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium font-mono text-foreground">
                    {rule.key}
                  </TableCell>
                  <TableCell className="text-foreground">
                    <code className="bg-white/10 px-2 py-1 rounded text-sm">
                      {String(rule.value)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={typeof rule.value === "boolean" ? "default" : "secondary"}>
                      {typeof rule.value}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground max-w-md">
                    {rule.description || (
                      <span className="text-muted-foreground italic">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(rule)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rule._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Rule" : "Add New Rule"}
            </DialogTitle>
            <DialogDescription>
              {editingRule
                ? "Update rule configuration and default value"
                : "Create a new business rule that merchants can customize"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rule-key">Rule Key *</Label>
              <Input
                id="rule-key"
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                placeholder="e.g., min_order_value, tax_enabled"
                disabled={!!editingRule}
              />
              <p className="text-xs text-muted-foreground">
                Use snake_case for rule keys (e.g., free_shipping_threshold)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Value Type *</Label>
              <RadioGroup
                value={formData.valueType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    valueType: value as "boolean" | "number",
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="boolean" id="boolean" />
                  <Label htmlFor="boolean" className="font-normal cursor-pointer">
                    Boolean (true/false)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="number" id="number" />
                  <Label htmlFor="number" className="font-normal cursor-pointer">
                    Number (e.g., thresholds, limits)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.valueType === "boolean" ? (
              <div className="space-y-2">
                <Label>Default Boolean Value *</Label>
                <RadioGroup
                  value={String(formData.boolValue)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, boolValue: value === "true" })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="font-normal cursor-pointer">
                      True (enabled)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="font-normal cursor-pointer">
                      False (disabled)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="num-value">Default Number Value *</Label>
                <Input
                  id="num-value"
                  type="number"
                  min="0"
                  value={formData.numValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="e.g., 50, 100"
                />
                <p className="text-xs text-muted-foreground">
                  Must be a non-negative number (&gt;= 0)
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what this rule does..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingRule ? "Updating..." : "Creating..."}
                </>
              ) : editingRule ? (
                "Update Rule"
              ) : (
                "Create Rule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RulesTab;
