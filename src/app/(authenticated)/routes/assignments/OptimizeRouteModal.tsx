import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Assignment } from '@/ts/interfaces/Assignments';
import { useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOptimize: (origin: 'home' | 'first', destination: 'home' | 'last') => void;
  assignments: Assignment[];
  userAddress: string;
}

export function OptimizeRouteModal({ open, onOpenChange, onOptimize, assignments, userAddress }: Props) {
  const firstAssignment = assignments[0];
  const lastAssignment = assignments[assignments.length - 1];

  const [origin, setOrigin] = useState<'home' | 'first'>('home');
  const [destination, setDestination] = useState<'home' | 'last'>('last');

  if (assignments.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Optimize Route</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> To optimize your route, first set your preferred first and last assignments on the assignments list, then return to this modal to optimize the route.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-medium">Starting Point</h4>
            <RadioGroup value={origin} onValueChange={(value: 'home' | 'first') => setOrigin(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="origin-home" />
                <Label htmlFor="origin-home">Your Home ({userAddress})</Label>
              </div>
              {firstAssignment && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="first" id="origin-first" />
                  <Label htmlFor="origin-first">
                    First Assignment ({firstAssignment.pool.name} - {firstAssignment.pool.address})
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <div>
            <h4 className="mb-4 font-medium">End Point</h4>
            <RadioGroup value={destination} onValueChange={(value: 'home' | 'last') => setDestination(value)}>
              {lastAssignment && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="last" id="dest-last" />
                  <Label htmlFor="dest-last">
                    Last Assignment ({lastAssignment.pool.name} - {lastAssignment.pool.address})
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="dest-home" />
                <Label htmlFor="dest-home">Your Home ({userAddress})</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onOptimize(origin, destination);
                onOpenChange(false);
              }}
            >
              Optimize
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
