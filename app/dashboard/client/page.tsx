"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import React, { useState } from "react";

const ClientDashboard: React.FC = () => {
    // Stats
    const [ongoingCount] = useState<number>(5);
    const [overdueCount] = useState<number>(2);

    // Calendar events placeholder
    const events = [
        {
            id: 1,
            date: new Date(),
            caseName: "Case A",
            participants: ["Client", "Lawyer X"],
            location: "Zoom",
            duration: "1h",
            lawyerInCharge: "Lawyer X",
            description: "Initial hearing",
        },
        // ... more events
    ];

    // Search modal state
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchParams, setSearchParams] = useState({ caseNumber: "", clientName: "", date: "" });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        // TODO: implement search logic (open panel with results)
        console.log("Searching with", searchParams);
    };

    return (
        <div className="p-4 space-y-6">
            {/* Header with Search */}
            <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Your Cases</h1>
                    <DialogTrigger asChild>
                        <Button>Search Cases</Button>
                    </DialogTrigger>
                </div>

                {/* Search Dialog */}
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Search Cases</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Case Number"
                            name="caseNumber"
                            value={searchParams.caseNumber}
                            onChange={handleSearchChange}
                        />
                        <Input
                            placeholder="Client Name"
                            name="clientName"
                            value={searchParams.clientName}
                            onChange={handleSearchChange}
                        />
                        <Input
                            type="date"
                            name="date"
                            value={searchParams.date}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSearch}>Search</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Ongoing Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="text-3xl font-bold">{ongoingCount}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Overdue Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="text-3xl font-bold text-red-600">{overdueCount}</span>
                    </CardContent>
                </Card>
                {/* Additional cards can go here */}
            </div>

            {/* Calendar View */}
            <Card>
                <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <Calendar
                        className="border rounded-md"
                        events={events.map((ev) => ({
                            date: ev.date,
                            render: () => (
                                <div className="p-2">
                                    <div className="font-semibold">{ev.caseName}</div>
                                    <div className="text-sm">{format(ev.date, "PPP p")} ({ev.duration})</div>
                                    <div className="text-sm">Lead: {ev.lawyerInCharge}</div>
                                </div>
                            ),
                        }))}
                    />
                </CardContent>
            </Card>

            {/* Placeholder for Case Folders List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Case Folders</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* TODO: list cases grouped by lawyer under folder UI */}
                    <p className="text-muted">Case folders will be listed here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientDashboard;
