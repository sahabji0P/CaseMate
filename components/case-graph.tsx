"use client"

import { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, X, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface CaseNode {
  id: string
  label: string
  status: "completed" | "pending" | "upcoming"
  caseId: string
  caseName: string
  stageIndex: number
}

interface CaseLink {
  source: string
  target: string
  caseId: string
}

interface CaseDocument {
  id: string
  title: string
  date: string
  summary: string
  type: string
}

export function CaseGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<CaseNode | null>(null)
  const [documents, setDocuments] = useState<CaseDocument[]>([])
  const [isInView, setIsInView] = useState(false)

  // Sample case data
  const caseData = {
    case1: {
      name: "Smith vs. Johnson",
      color: "#3b82f6", // Blue
      stages: [
        { id: "case1-complaint", label: "Complaint", status: "completed", stageIndex: 0 },
        { id: "case1-response", label: "Response", status: "completed", stageIndex: 1 },
        { id: "case1-evidence", label: "Evidence", status: "completed", stageIndex: 2 },
        { id: "case1-hearing", label: "Hearing", status: "pending", stageIndex: 3 },
        { id: "case1-judgment", label: "Judgment", status: "upcoming", stageIndex: 4 },
      ],
    },
    case2: {
      name: "Property Acquisition",
      color: "#10b981", // Green
      stages: [
        { id: "case2-filing", label: "Filing", status: "completed", stageIndex: 0 },
        { id: "case2-review", label: "Review", status: "completed", stageIndex: 1 },
        { id: "case2-approval", label: "Approval", status: "pending", stageIndex: 2 },
        { id: "case2-closing", label: "Closing", status: "upcoming", stageIndex: 3 },
      ],
    },
    case3: {
      name: "Insurance Claim",
      color: "#8b5cf6", // Purple
      stages: [
        { id: "case3-claim", label: "Claim", status: "completed", stageIndex: 0 },
        { id: "case3-investigation", label: "Investigation", status: "pending", stageIndex: 1 },
        { id: "case3-settlement", label: "Settlement", status: "upcoming", stageIndex: 2 },
      ],
    },
  }

  // Sample document data
  const documentData: Record<string, CaseDocument[]> = {
    "case1-complaint": [
      { id: "doc1", title: "Complaint.pdf", date: "Apr 10, 2025", summary: "Initial complaint filing", type: "PDF" },
      { id: "doc2", title: "Evidence A.pdf", date: "Apr 11, 2025", summary: "Supporting evidence", type: "PDF" },
    ],
    "case1-response": [
      { id: "doc3", title: "Response.docx", date: "Apr 15, 2025", summary: "Defendant's response", type: "DOCX" },
    ],
    "case1-evidence": [
      { id: "doc4", title: "Witness Statement.pdf", date: "Apr 17, 2025", summary: "Witness testimony", type: "PDF" },
      { id: "doc5", title: "Photos.zip", date: "Apr 18, 2025", summary: "Photo evidence", type: "ZIP" },
    ],
    "case2-filing": [
      {
        id: "doc6",
        title: "Property Filing.pdf",
        date: "Apr 12, 2025",
        summary: "Initial property filing",
        type: "PDF",
      },
    ],
    "case2-review": [
      {
        id: "doc7",
        title: "Review Report.docx",
        date: "Apr 16, 2025",
        summary: "Property review report",
        type: "DOCX",
      },
    ],
    "case3-claim": [
      {
        id: "doc8",
        title: "Insurance Claim.pdf",
        date: "Apr 14, 2025",
        summary: "Initial insurance claim",
        type: "PDF",
      },
    ],
  }

  // Prepare nodes and links for the graph
  const nodes: CaseNode[] = Object.entries(caseData).flatMap(([caseId, caseInfo]) =>
    caseInfo.stages.map((stage) => ({
      ...stage,
      caseId,
      caseName: caseInfo.name,
    })),
  )

  const links: CaseLink[] = Object.entries(caseData).flatMap(([caseId, caseInfo]) =>
    caseInfo.stages.slice(0, -1).map((stage, index) => ({
      source: stage.id,
      target: caseInfo.stages[index + 1].id,
      caseId,
    })),
  )

  const handleNodeClick = (node: CaseNode) => {
    setSelectedNode(node)
    setDocuments(documentData[node.id] || [])
  }

  // Check if element is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!svgRef.current || !isInView) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up SVG
    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = 350
    const margin = { top: 40, right: 40, bottom: 40, left: 120 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create a group for the graph
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Group nodes by case
    const caseGroups = d3.group(nodes, (d) => d.caseId)

    // Calculate vertical spacing between cases
    const caseSpacing = innerHeight / caseGroups.size

    // Create a horizontal scale for node positioning based on stage index
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(nodes, (d) => d.stageIndex) || 0])
      .range([50, innerWidth - 50])

    // Add case background panels
    g.selectAll(".case-panel")
      .data(Array.from(caseGroups.entries()))
      .enter()
      .append("rect")
      .attr("class", "case-panel")
      .attr("x", -100)
      .attr("y", (d, i) => i * caseSpacing - 20)
      .attr("width", innerWidth + 150)
      .attr("height", caseSpacing - 10)
      .attr("rx", 12)
      .attr("ry", 12)
      .attr("fill", (d) => `${caseData[d[0]].color}10`)
      .attr("stroke", (d) => `${caseData[d[0]].color}30`)
      .attr("stroke-width", 1)

    // Draw links with gradient
    const linkGroups = g.selectAll(".link-group").data(links).enter().append("g").attr("class", "link-group")

    // Create gradient definitions
    const defs = svg.append("defs")

    links.forEach((link, i) => {
      const sourceNode = nodes.find((n) => n.id === link.source)
      const targetNode = nodes.find((n) => n.id === link.target)
      if (!sourceNode || !targetNode) return

      const gradientId = `link-gradient-${i}`
      const gradient = defs
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", xScale(sourceNode.stageIndex))
        .attr("y1", Array.from(caseGroups.keys()).indexOf(sourceNode.caseId) * caseSpacing + caseSpacing / 2)
        .attr("x2", xScale(targetNode.stageIndex))
        .attr("y2", Array.from(caseGroups.keys()).indexOf(targetNode.caseId) * caseSpacing + caseSpacing / 2)

      const caseColor = caseData[link.caseId].color

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", sourceNode.status === "completed" ? caseColor : "#94a3b8")

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", targetNode.status === "completed" ? caseColor : "#94a3b8")
    })

    // Draw the links
    linkGroups
      .append("path")
      .attr("class", "link")
      .attr("d", (d: any) => {
        const sourceNode = nodes.find((n) => n.id === d.source)
        const targetNode = nodes.find((n) => n.id === d.target)
        if (!sourceNode || !targetNode) return ""

        const sourceY = Array.from(caseGroups.keys()).indexOf(sourceNode.caseId) * caseSpacing + caseSpacing / 2
        const targetY = Array.from(caseGroups.keys()).indexOf(targetNode.caseId) * caseSpacing + caseSpacing / 2
        const sourceX = xScale(sourceNode.stageIndex)
        const targetX = xScale(targetNode.stageIndex)

        return `M${sourceX},${sourceY} L${targetX},${targetY}`
      })
      .attr("stroke", (d, i) => `url(#link-gradient-${i})`)
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .attr("stroke-linecap", "round")
      .attr("filter", "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))")

    // Add arrow markers for links
    linkGroups
      .append("path")
      .attr("d", (d: any) => {
        const sourceNode = nodes.find((n) => n.id === d.source)
        const targetNode = nodes.find((n) => n.id === d.target)
        if (!sourceNode || !targetNode) return ""

        const sourceY = Array.from(caseGroups.keys()).indexOf(sourceNode.caseId) * caseSpacing + caseSpacing / 2
        const targetY = Array.from(caseGroups.keys()).indexOf(targetNode.caseId) * caseSpacing + caseSpacing / 2
        const sourceX = xScale(sourceNode.stageIndex)
        const targetX = xScale(targetNode.stageIndex) - 15 // Offset for arrow

        // Calculate angle for the arrow
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX)

        // Arrow points
        const arrowSize = 8
        const arrowX = targetX
        const arrowY = targetY

        return `M${arrowX},${arrowY} 
                L${arrowX - arrowSize * Math.cos(angle) + arrowSize * Math.sin(angle)},${arrowY - arrowSize * Math.sin(angle) - arrowSize * Math.cos(angle)} 
                L${arrowX - arrowSize * Math.cos(angle) - arrowSize * Math.sin(angle)},${arrowY - arrowSize * Math.sin(angle) + arrowSize * Math.cos(angle)} 
                Z`
      })
      .attr("fill", (d) => {
        const targetNode = nodes.find((n) => n.id === d.target)
        if (!targetNode) return "#94a3b8"
        return targetNode.status === "completed" ? caseData[d.caseId].color : "#94a3b8"
      })

    // Create case labels with badges
    g.selectAll(".case-label-group")
      .data(Array.from(caseGroups.entries()))
      .enter()
      .append("g")
      .attr("class", "case-label-group")
      .attr("transform", (d, i) => `translate(-110, ${i * caseSpacing + caseSpacing / 2})`)
      .each(function (d) {
        const g = d3.select(this)

        // Add case badge
        g.append("rect")
          .attr("rx", 8)
          .attr("ry", 8)
          .attr("width", 100)
          .attr("height", 28)
          .attr("x", 0)
          .attr("y", -14)
          .attr("fill", caseData[d[0]].color)
          .attr("opacity", 0.9)
          .attr("filter", "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))")

        // Add case name
        g.append("text")
          .attr("x", 50)
          .attr("y", 0)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .text(caseData[d[0]].name.length > 15 ? caseData[d[0]].name.substring(0, 15) + "..." : caseData[d[0]].name)
      })

    // Draw nodes
    const nodeGroups = g
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => {
        const y = Array.from(caseGroups.keys()).indexOf(d.caseId) * caseSpacing + caseSpacing / 2
        return `translate(${xScale(d.stageIndex)},${y})`
      })
      .style("cursor", "pointer")
      .on("click", (event, d) => handleNodeClick(d))

    // Add node glow filter
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")

    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur")

    filter.append("feComposite").attr("in", "SourceGraphic").attr("in2", "blur").attr("operator", "over")

    // Add hexagon nodes
    nodeGroups.each(function (d: any) {
      const g = d3.select(this)
      const caseColor = caseData[d.caseId].color
      const nodeColor = d.status === "completed" ? caseColor : d.status === "pending" ? "#f59e0b" : "#94a3b8"

      // Create hexagon path
      const hexagonRadius = 22
      const hexagonPoints = []
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        hexagonPoints.push([hexagonRadius * Math.cos(angle), hexagonRadius * Math.sin(angle)])
      }

      // Draw hexagon background glow
      g.append("path")
        .attr(
          "d",
          d3
            .line()
            .x((d) => d[0])
            .y((d) => d[1])(hexagonPoints),
        )
        .attr("fill", nodeColor)
        .attr("opacity", 0.3)
        .attr("filter", "url(#glow)")
        .attr("transform", "scale(1.2)")

      // Draw hexagon
      g.append("path")
        .attr(
          "d",
          d3
            .line()
            .x((d) => d[0])
            .y((d) => d[1])(hexagonPoints),
        )
        .attr("fill", nodeColor)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("filter", "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))")

      // Add text
      g.append("text")
        .text(d.label)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .style("pointer-events", "none")
    })

    // Add hover and click effects
    nodeGroups
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", (d: any) => {
            const y = Array.from(caseGroups.keys()).indexOf(d.caseId) * caseSpacing + caseSpacing / 2
            return `translate(${xScale(d.stageIndex)},${y}) scale(1.1)`
          })
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", (d: any) => {
            const y = Array.from(caseGroups.keys()).indexOf(d.caseId) * caseSpacing + caseSpacing / 2
            return `translate(${xScale(d.stageIndex)},${y}) scale(1)`
          })
      })
  }, [isInView])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="w-full h-[350px] overflow-x-auto">
        <svg ref={svgRef} width="100%" height="100%" />
      </div>

      {selectedNode && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="mt-4 border-blue-200 dark:border-blue-800">
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <Badge style={{ backgroundColor: caseData[selectedNode.caseId].color }} className="mr-2">
                  {selectedNode.caseName}
                </Badge>
                {selectedNode.label} Stage
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setSelectedNode(null)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center space-x-2 mb-3">
                <Badge
                  variant={
                    selectedNode.status === "completed"
                      ? "default"
                      : selectedNode.status === "pending"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {documents.length} document{documents.length !== 1 ? "s" : ""}
                </span>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: documents.indexOf(doc) * 0.1 }}
                      className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{doc.title}</h3>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                        <p className="text-xs mt-1">{doc.summary}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No documents available for this stage</div>
              )}

              <div className="mt-4 flex justify-end">
                <Button size="sm" className="shimmer-button bg-blue-600 hover:bg-blue-700">
                  View Case Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
