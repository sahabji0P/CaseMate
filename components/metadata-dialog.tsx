"use client"

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface MetadataDialogProps {
    isOpen: boolean;
    onClose: () => void;
    metadata: {
        title?: string;
        author?: string;
        date?: string;
        summary?: string;
        keyPoints?: string[];
        [key: string]: any;
    };
}

export function MetadataDialog({ isOpen, onClose, metadata }: MetadataDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Document Metadata</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {Object.entries(metadata).map(([key, value]) => {
                        if (!value) return null;

                        return (
                            <div key={key} className="space-y-2">
                                <h3 className="text-sm font-medium capitalize">{key}</h3>
                                {Array.isArray(value) ? (
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                        {value.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">{value}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 