import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DollarSign, CircleCheck, MessageCircle, X } from "lucide-react"

const DashboardDialog01 = () => {
  return (
    <Dialog open={true}>
      <DialogContent showCloseButton={false} className="w-[620px] max-w-none p-6 rounded-[10px] shadow-lg">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="flex items-center justify-center size-11 rounded-lg border">
            <DollarSign className="size-6" />
          </div>
          <div className="flex flex-col gap-0">
            <DialogTitle className="text-lg font-semibold text-left">Select Plan</DialogTitle>
            <p className="text-sm text-muted-foreground">Simple and flexible per-user pricing</p>
          </div>
        </DialogHeader>

        <div className="flex gap-6">
          <div className="w-[274px] border rounded-lg p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium">Basic plan</h3>
              <p className="text-2xl font-bold">$10/user</p>
              <p className="text-sm text-muted-foreground">Includes 20GB individual data.</p>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">32+ integrations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">Basic reporting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">20GB individual data</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">Basic support</span>
              </div>
            </div>

            <RadioGroup defaultValue="basic">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="basic" className="border border-border shadow-sm" />
              </div>
            </RadioGroup>
          </div>

          <div className="w-[274px] border rounded-lg p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium">Starter Package</h3>
              <p className="text-2xl font-bold">$12/user</p>
              <p className="text-sm text-muted-foreground">Comes with 512GB personal data.</p>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">35+ integrations available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">Essential reporting features</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">512GB personal data included</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CircleCheck className="size-5" />
                <span className="text-sm">Standard support services</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" className="bg-card text-primary h-10 px-6">
            <MessageCircle className="size-4 mr-2" />
            Chat with us
          </Button>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-10 px-6 shadow-sm">
              Cancel
            </Button>
            <Button className="h-10 px-6">
              Purchase now
            </Button>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="absolute right-4 top-4 size-5 p-0">
          <X className="size-2.5" />
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default DashboardDialog01