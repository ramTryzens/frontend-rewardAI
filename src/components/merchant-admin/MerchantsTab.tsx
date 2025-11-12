import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Copy, Eye, EyeOff } from "lucide-react";
import {
  getMerchants,
  createMerchant,
  updateMerchant,
  deleteMerchant,
  getEcommerceDetails,
  getRules,
  type Merchant,
  type EcommerceDetail,
  type Rule,
} from "@/lib/api";

const MerchantsTab = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    accessKey: "",
    selectedRules: {} as Record<string, boolean | number>,
  });

  // Fetch data
  const { data: merchants, isLoading: loadingMerchants } = useQuery({
    queryKey: ["merchants"],
    queryFn: getMerchants,
  });

  const { data: platforms, isLoading: loadingPlatforms } = useQuery({
    queryKey: ["ecommerce-details"],
    queryFn: getEcommerceDetails,
  });

  const { data: rules, isLoading: loadingRules } = useQuery({
    queryKey: ["rules"],
    queryFn: getRules,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      toast.success("Merchant created successfully");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create merchant");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Merchant> }) =>
      updateMerchant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      toast.success("Merchant updated successfully");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update merchant");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      toast.success("Merchant deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete merchant");
    },
  });

  const handleOpenDialog = (merchant?: Merchant) => {
    if (merchant) {
      setEditingMerchant(merchant);
      setFormData({
        name: merchant.name,
        platform: merchant.ecomDetails.platform,
        accessKey: merchant.ecomDetails.accessKey,
        selectedRules: merchant.businessRules,
      });
    } else {
      setEditingMerchant(null);
      setFormData({
        name: "",
        platform: "",
        accessKey: "",
        selectedRules: {},
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMerchant(null);
    setShowAccessKey(false);
    setFormData({
      name: "",
      platform: "",
      accessKey: "",
      selectedRules: {},
    });
  };

  const handleRuleToggle = (ruleKey: string, ruleValue: boolean | number, checked: boolean) => {
    setFormData((prev) => {
      const newRules = { ...prev.selectedRules };
      if (checked) {
        newRules[ruleKey] = ruleValue;
      } else {
        delete newRules[ruleKey];
      }
      console.log('Updated selectedRules:', newRules);
      return { ...prev, selectedRules: newRules };
    });
  };

  const handleRuleValueChange = (ruleKey: string, newValue: string) => {
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= 0) {
      setFormData((prev) => ({
        ...prev,
        selectedRules: {
          ...prev.selectedRules,
          [ruleKey]: numValue,
        },
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.platform || !formData.accessKey) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Object.keys(formData.selectedRules).length === 0) {
      toast.error("Please select at least one business rule");
      return;
    }

    const merchantData = {
      name: formData.name,
      ecomDetails: {
        platform: formData.platform,
        accessKey: formData.accessKey,
      },
      businessRules: formData.selectedRules,
    };

    if (editingMerchant) {
      updateMutation.mutate({ id: editingMerchant._id, data: merchantData });
    } else {
      createMutation.mutate(merchantData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this merchant?")) {
      deleteMutation.mutate(id);
    }
  };

  if (loadingMerchants || loadingPlatforms || loadingRules) {
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
          <h2 className="text-2xl font-bold text-foreground">Merchants</h2>
          <p className="text-sm text-muted-foreground">
            Manage merchant configurations and their business rules
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Merchant
        </Button>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5 border-white/10">
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Platform</TableHead>
              <TableHead className="text-foreground">Access Key</TableHead>
              <TableHead className="text-foreground">Business Rules</TableHead>
              <TableHead className="text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No merchants found. Create your first merchant to get started.
                </TableCell>
              </TableRow>
            ) : (
              merchants?.map((merchant) => (
                <TableRow key={merchant._id} className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium text-foreground">
                    {merchant.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {merchant.ecomDetails.platform}
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{'•'.repeat(20)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(merchant.ecomDetails.accessKey);
                          toast.success("Access key copied to clipboard");
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(merchant.businessRules)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <span
                            key={key}
                            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      {Object.keys(merchant.businessRules).length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{Object.keys(merchant.businessRules).length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(merchant)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(merchant._id)}
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMerchant ? "Edit Merchant" : "Add New Merchant"}
            </DialogTitle>
            <DialogDescription>
              {editingMerchant
                ? "Update merchant details and business rules"
                : "Create a new merchant with platform and business rules"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Merchant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., ACME Store"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms
                    ?.filter((p) => p.enabled)
                    .map((platform) => (
                      <SelectItem key={platform._id} value={platform.name}>
                        {platform.name} (v{platform.api_version})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessKey">Access Key *</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="accessKey"
                    type={showAccessKey ? "text" : "password"}
                    value={formData.accessKey}
                    onChange={(e) =>
                      setFormData({ ...formData, accessKey: e.target.value })
                    }
                    placeholder="Enter API access key"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAccessKey(!showAccessKey)}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    {showAccessKey ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.accessKey && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(formData.accessKey);
                      toast.success("Access key copied to clipboard");
                    }}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Business Rules * (Select at least one)</Label>
              <div className="border border-white/10 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                {!rules || rules.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No business rules available. Please create rules first in the Rules tab.
                  </div>
                ) : (
                  rules.map((rule) => {
                    const isChecked = formData.selectedRules[rule.key] !== undefined;
                    console.log(`Rule ${rule.key} checked state:`, isChecked, formData.selectedRules);

                    return (
                      <div
                        key={rule._id}
                        className="flex items-start gap-3 p-3 rounded border border-white/10 hover:bg-white/5 hover:border-white/20 transition-colors"
                      >
                        <Checkbox
                          id={`rule-${rule._id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const ruleValue = rule.value !== undefined ? rule.value : rule.enabled;
                            console.log('Checkbox onCheckedChange:', rule.key, 'checked=', checked, 'ruleValue=', ruleValue);
                            handleRuleToggle(rule.key, ruleValue, checked === true);
                          }}
                          className="mt-1"
                        />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`rule-${rule._id}`}
                            className="font-medium text-sm cursor-pointer"
                          >
                            {rule.key}
                          </label>
                          {typeof rule.value === "number" &&
                            formData.selectedRules[rule.key] !== undefined && (
                              <Input
                                type="number"
                                min="0"
                                value={
                                  typeof formData.selectedRules[rule.key] === "number"
                                    ? (formData.selectedRules[rule.key] as number)
                                    : rule.value
                                }
                                onChange={(e) =>
                                  handleRuleValueChange(rule.key, e.target.value)
                                }
                                className="w-24 h-7 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                        </div>
                        {rule.description && (
                          <p className="text-xs text-muted-foreground">
                            {rule.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Default: {String(rule.value !== undefined ? rule.value : rule.enabled)} ({typeof (rule.value !== undefined ? rule.value : rule.enabled)})
                        </p>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
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
                  {editingMerchant ? "Updating..." : "Creating..."}
                </>
              ) : editingMerchant ? (
                "Update Merchant"
              ) : (
                "Create Merchant"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MerchantsTab;
