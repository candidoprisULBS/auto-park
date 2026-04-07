import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";

export function Settings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your parking facility configuration</p>
      </div>

      {/* General Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="facility-name">Facility Name</Label>
            <Input id="facility-name" defaultValue="AutoPark Pro" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue="123 Main Street, City, State 12345" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="contact@autoparkpro.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
              <Input id="hourly-rate" type="number" defaultValue="6.50" step="0.50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-max">Daily Maximum ($)</Label>
              <Input id="daily-max" type="number" defaultValue="45.00" step="1.00" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grace-period">Grace Period (minutes)</Label>
              <Input id="grace-period" type="number" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-charge">Minimum Charge ($)</Label>
              <Input id="min-charge" type="number" defaultValue="3.00" step="0.50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Capacity Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone-a">Zone A Spots</Label>
              <Input id="zone-a" type="number" defaultValue="80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone-b">Zone B Spots</Label>
              <Input id="zone-b" type="number" defaultValue="90" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone-c">Zone C Spots</Label>
              <Input id="zone-c" type="number" defaultValue="80" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reserved">Reserved Spots</Label>
            <Input id="reserved" type="number" defaultValue="25" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive email alerts for important events</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Capacity Alerts</Label>
              <p className="text-sm text-gray-600">Alert when available spots drop below 10%</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Notifications</Label>
              <p className="text-sm text-gray-600">Notify on successful payments</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Reports</Label>
              <p className="text-sm text-gray-600">Receive daily summary reports via email</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>24/7 Operation</Label>
              <p className="text-sm text-gray-600">Facility operates around the clock</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="open-time">Opening Time</Label>
              <Input id="open-time" type="time" defaultValue="00:00" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-time">Closing Time</Label>
              <Input id="close-time" type="time" defaultValue="23:59" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button size="lg">Save Changes</Button>
        <Button variant="outline" size="lg">Cancel</Button>
      </div>
    </div>
  );
}
