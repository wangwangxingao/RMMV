/*
Copyright (C) 2008-10 University of North Carolina at Chapel Hill.
All rights reserved.
Permission to use, copy, modify, and distribute this software and its
documentation for educational, research, and non-profit purposes, without fee,
and without a written agreement is hereby granted, provided that the above
copyright notice, this paragraph, and the following four paragraphs appear in
all copies.
Permission to incorporate this software into commercial products may be obtained
by contacting the University of North Carolina at Chapel Hill.
This software program and documentation are copyrighted by the University of
North Carolina at Chapel Hill. The software program and documentation are
supplied "as is", without any accompanying services from the University of North
Carolina at Chapel Hill or the authors. The University of North Carolina at
Chapel Hill and the authors do not warrant that the operation of the program
will be uninterrupted or error-free. The end-user understands that the program
was developed for research purposes and is advised not to rely exclusively on
the program for any reason.
IN NO EVENT SHALL THE UNIVERSITY OF NORTH CAROLINA AT CHAPEL HILL OR ITS
EMPLOYEES OR THE AUTHORS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL,
INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE
USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE UNIVERSITY OF NORTH
CAROLINA AT CHAPEL HILL OR THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.
THE UNIVERSITY OF NORTH CAROLINA AT CHAPEL HILL AND THE AUTHORS SPECIFICALLY
DISCLAIM ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE AND ANY STATUTORY
WARRANTY OF NON-INFRINGEMENT. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS"
BASIS, AND THE UNIVERSITY OF NORTH CAROLINA AT CHAPEL HILL AND THE AUTHORS HAVE
NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
MODIFICATIONS.
*/

/**Reciprocal Velocity Obstacles 相互速度障碍 */
var RVO = RVO || {};


/**
 * 代理
 * @param {*} sim 模拟电脑
 */
RVO.Agent = function (sim) {
    /**模拟电脑 */
    this.sim = sim;

    /**代理邻居组 */
    this.agentNeighbors = [];
    /**最大邻居数 */
    this.maxNeighbors = 0;
    /**最大速度 */
    this.maxSpeed = 0;
    /**邻居距离 */
    this.neighborDist = 0;
    /**新速度 */
    this.newVelocity = [0, 0];
    /**障碍邻居组 */
    this.obstacleNeighbors = [];
    /**线组 */
    this.orcaLines = [];
    /**位置 */
    this.position = [0, 0];
    /**模拟电脑 */
    this.sim = sim;
    /**时间跨度 */
    this.timeHorizon = 0;
    /**时间跨度障碍 */
    this.timeHorizonObst = 0;
    /**速度 */
    this.velocity = [0, 0];
    /**id */
    this.id = 0;
}

/**
 * 计算邻居组
 */
RVO.Agent.prototype.computeNeighbors = function () {
    /**障碍邻居组 */
    this.obstacleNeighbors = [];
    /**距离平方 = 平方( 时间跨度障碍 * 最大速度 + 半径 ) */
    var rangeSq = RVO.sqr(this.timeHorizonObst * this.maxSpeed + this.radius);
    /**模拟电脑 kd树 计算障碍邻居组(this ,距离平方 )*/
    this.sim.kdTree.computeObstacleNeighbors(this, rangeSq);
    /**代理邻居组 */
    this.agentNeighbors = [];
    /**如果(最大邻居数 > 0) */
    if (this.maxNeighbors > 0) {
        //距离平方 =  平方( 邻居距离 )
        rangeSq = RVO.sqr(this.neighborDist);
        /**模拟电脑 kd树 计算代理邻居组(this ,距离平方 )*/
        this.sim.kdTree.computeAgentNeighbors(this, rangeSq);
    }
}

/**
 * 计算新速度
 */
RVO.Agent.prototype.computeNewVelocity = function () {
    /**线组 */
    this.orcaLines = [];
    /**求逆时间跨度障碍 = 1/时间跨度障碍 */
    var invTimeHorizonObst = 1 / this.timeHorizonObst;

    /** */
    for (var i = 0, ilen = this.obstacleNeighbors.length; i < ilen; ++i) {
        /**障碍1 障碍邻居组[i][1]*/
        var obstacle1 = this.obstacleNeighbors[i][1]
            /**障碍2 = 障碍1 下一个障碍 */
            , obstacle2 = obstacle1.nextObstacle
            /**相对位置1 = 减去(障碍1 点 , 位置) */
            , relativePosition1 = RVO.Vector.subtract(obstacle1.point, this.position)
            /** 相对位置2 = 减去(障碍2 点 , 位置)*/
            , relativePosition2 = RVO.Vector.subtract(obstacle2.point, this.position)
            /**已经涵盖 = false */
            , alreadyCovered = false;

        /**  线组  */
        for (var j = 0, jlen = this.orcaLines.length; j < jlen; ++j) {
            //向量积(相乘(相对位置1, 线组[j][0], 求逆时间跨度障碍), 线组[j][1])
            if (
                RVO.Vector.det(
                    RVO.Vector.multiply(
                        RVO.Vector.subtract(
                            relativePosition1,
                            this.orcaLines[j][0]),
                        invTimeHorizonObst
                    ),
                    this.orcaLines[j][1]
                ) - invTimeHorizonObst * this.radius >= - RVO.EPSILON &&
                //向量积(相乘(相对位置2, 线组[j][0], 求逆时间跨度障碍), 线组[j][0])
                RVO.Vector.det(
                    RVO.Vector.multiply(
                        RVO.Vector.subtract(
                            relativePosition2,
                            this.orcaLines[j][0]),
                        invTimeHorizonObst
                    ),
                    this.orcaLines[j][1]
                // - 求逆时间跨度障碍  * 半径  >= - 小量
                ) - invTimeHorizonObst * this.radius >= - RVO.EPSILON
            ) {
                /**已经涵盖 = true  */
                alreadyCovered = true;
                break;
            }
        }

        /**已经涵盖 = true  */
        if (alreadyCovered) {
            /**下一个 */
            continue;
        }

        var distSq1 = RVO.Vector.absSq(relativePosition1)
            , distSq2 = RVO.Vector.absSq(relativePosition2)
            , radiusSq = RVO.sqr(this.radius)
            , obstacleVector = RVO.Vector.subtract(obstacle2.point, obstacle1.point)
            , s = RVO.Vector.dotProduct(RVO.Vector.invert(relativePosition1), obstacleVector) / RVO.Vector.absSq(obstacleVector)
            , distSqLine = RVO.Vector.absSq(RVO.Vector.subtract(RVO.Vector.invert(relativePosition1), RVO.Vector.multiply(obstacleVector, s)))
            , line = new Array(2);

        if (s < 0 && distSq1 <= radiusSq) {
            if (obstacle1.isConvex) {
                line[0] = [0, 0];
                line[1] = RVO.Vector.normalize([- relativePosition1[1], relativePosition1[0]]);
                this.orcaLines.push(line);
            }
            continue;
        }
        else if (s > 1 && distSq2 <= radiusSq) {
            if (obstacle2.isConvex && RVO.Vector.det(relativePosition2, obstacle2.unitDir) >= 0) {
                line[0] = [0, 0];
                line[1] = RVO.Vector.normalize([- relativePosition2[1], relativePosition2[0]]);;
                this.orcaLines.push(line);
            }
            continue;
        }
        else if (s >= 0 && s < 1 && distSqLine <= radiusSq) {
            line[0] = [0, 0];
            line[1] = RVO.Vector.invert(obstacle1.unitDir);
            this.orcaLines.push(line);
            continue;
        }

        var leftLegDirection, rightLegDirection;

        if (s < 0 && distSqLine <= radiusSq) {
            if (!obstacle1.isConvex) {
                continue;
            }

            obstacle2 = obstacle1;

            var leg1 = Math.sqrt(distSq1 - radiusSq);
            leftLegDirection = RVO.Vector.divide([relativePosition1[0] * leg1 - relativePosition1[1] * this.radius, relativePosition1[0] * this.radius + relativePosition1[1] * leg1], distSq1);
            rightLegDirection = RVO.Vector.divide([relativePosition1[0] * leg1 + relativePosition1[1] * this.radius, - relativePosition1[0] * this.radius + relativePosition1[1] * leg1], distSq1);
        }
        else if (s > 1 && distSqLine <= radiusSq) {
            if (!obstacle2.isConvex) {
                continue;
            }

            obstacle1 = obstacle2;

            var leg2 = Math.sqrt(distSq2 - radiusSq);
            leftLegDirection = RVO.Vector.divide([relativePosition2[0] * leg2 - relativePosition2[1] * this.radius, relativePosition2[0] * this.radius + relativePosition2[1] * leg2], distSq2);
            rightLegDirection = RVO.Vector.divide([relativePosition2[0] * leg2 + relativePosition2[1] * this.radius, - relativePosition2[0] * this.radius + relativePosition2[1] * leg2], distSq2);
        }
        else {
            if (obstacle1.isConvex) {
                leg1 = Math.sqrt(distSq1 - radiusSq);
                leftLegDirection = RVO.Vector.divide([relativePosition1[0] * leg1 - relativePosition1[1] * this.radius, relativePosition1[0] * this.radius + relativePosition1[1] * leg1], distSq1);
            }
            else {
                leftLegDirection = RVO.Vector.invert(obstacle1.unitDir);
            }

            if (obstacle2.isConvex) {
                leg2 = Math.sqrt(distSq2 - radiusSq);
                rightLegDirection = RVO.Vector.divide([relativePosition2[0] * leg2 + relativePosition2[1] * this.radius, - relativePosition2[0] * this.radius + relativePosition2[1] * leg2], distSq2);
            }
            else {
                rightLegDirection = obstacle1.unitDir;
            }
        }

        var leftNeighbor = obstacle1.prevObstacle
            , isLeftLegForeign = false
            , isRightLegForeign = false;

        if (obstacle1.isConvex && RVO.Vector.det(leftLegDirection, RVO.Vector.invert(leftNeighbor.unitDir)) >= 0) {
            leftLegDirection = RVO.Vector.invert(leftNeighbor.unitDir);
            isLeftLegForeign = true;
        }

        if (obstacle2.isConvex && RVO.Vector.det(rightLegDirection, obstacle2.unitDir) <= 0) {
            rightLegDirection = RVO.Vector.invert(obstacle2.unitDir);
            isRightLegForeign = true;
        }

        var leftCutoff = RVO.Vector.multiply(RVO.Vector.subtract(obstacle1.point, this.position), invTimeHorizonObst)
            , rightCutoff = RVO.Vector.multiply(RVO.Vector.subtract(obstacle2.point, this.position), invTimeHorizonObst)
            , cutoffVec = RVO.Vector.subtract(rightCutoff, leftCutoff)
            , t = (obstacle1 == obstacle2) ? .5 : RVO.Vector.dotProduct(RVO.Vector.subtract(this.velocity, leftCutoff), cutoffVec) / RVO.Vector.absSq(cutoffVec)
            , tLeft = RVO.Vector.dotProduct(RVO.Vector.subtract(this.velocity, leftCutoff), leftLegDirection)
            , tRight = RVO.Vector.dotProduct(RVO.Vector.subtract(this.velocity, rightCutoff), rightLegDirection);

        if ((t < 0 && tLeft < 0) || (obstacle1 == obstacle2 && tLeft < 0 && tRight < 0)) {
            var unitW = RVO.Vector.normalize(RVO.Vector.subtract(this.velocity, leftCutoff));
            line[1] = [unitW[1], - unitW[0]];
            line[0] = RVO.Vector.add(RVO.Vector.multiply(unitW, this.radius * invTimeHorizonObst), leftCutoff);
            this.orcaLines.push(line);
            continue;
        }
        else if (t > 1 && tRight < 0) {
            var unitW = RVO.Vector.normalize(RVO.Vector.subtract(this.velocity, rightCutoff));
            line[1] = [unitW[1], - unitW[0]];
            line[0] = RVO.Vector.add(RVO.Vector.multiply(unitW, this.radius * invTimeHorizonObst), rightCutoff);
            this.orcaLines.push(line);
            continue;
        }

        var distSqCutoff = (t < 0 || t > 1 || obstacle1 == obstacle2) ? Infinity : RVO.Vector.absSq(RVO.Vector.subtract(this.velocity, RVO.Vector.add(leftCutoff, RVO.Vector.multiply(cutoffVec, t))))
            , distSqLeft = tLeft < 0 ? Infinity : RVO.Vector.absSq(RVO.Vector.subtract(this.velocity, RVO.Vector.add(leftCutoff, RVO.Vector.multiply(leftLegDirection, tLeft))))
            , distSqRight = tRight < 0 ? Infinity : RVO.Vector.absSq(RVO.Vector.subtract(this.velocity, RVO.Vector.add(rightCutoff, RVO.Vector.multiply(rightLegDirection, tRight))));

        if (distSqCutoff <= distSqLeft && distSqCutoff <= distSqRight) {
            line[1] = RVO.Vector.invert(obstacle1.unitDir);
            line[0] = RVO.Vector.add(leftCutoff, RVO.Vector.multiply([- line[1][1], line[1][0]], this.radius * invTimeHorizonObst));
            this.orcaLines.push(line);
            continue;
        }
        else if (distSqLeft <= distSqRight) {
            if (isLeftLegForeign) {
                continue;
            }

            line[1] = leftLegDirection;
            line[0] = RVO.Vector.add(leftCutoff, RVO.Vector.multiply([- line[1][1], line[1][0]], this.radiuis * invTimeHorizonObst));
            this.orcaLines.push(line);
            continue;
        }
        else {
            if (isRightLegForeign) {
                continue;
            }

            line[1] = RVO.Vector.invert(rightLegDirection);
            line[0] = RVO.Vector.add(rightCutoff, RVO.Vector.multiply([line[1][1], line[1][0]], this.radius * invTimeHorizonObst));
            this.orcaLines.push(line);
            continue;
        }
    }

    var numObstLines = this.orcaLines.length
        , invTimeHorizon = 1 / this.timeHorizon;

    for (var i = 0, len = this.agentNeighbors.length; i < len; ++i) {
        var other = this.agentNeighbors[i][1]
            , relativePosition = RVO.Vector.subtract(other.position, this.position)
            , relativeVelocity = RVO.Vector.subtract(this.velocity, other.velocity)
            , distSq = RVO.Vector.absSq(relativePosition)
            , combinedRadius = this.radius + other.radius
            , combinedRadiusSq = RVO.sqr(combinedRadius)
            , line = new Array(2);

        if (distSq > combinedRadiusSq) {
            var w = RVO.Vector.subtract(relativeVelocity, RVO.Vector.multiply(relativePosition, invTimeHorizon))
                , wLengthSq = RVO.Vector.absSq(w)
                , dotProduct1 = RVO.Vector.dotProduct(w, relativePosition);

            if (dotProduct1 < 0 && RVO.sqr(dotProduct1) > combinedRadiusSq * wLengthSq) {
                var wLength = Math.sqrt(wLengthSq)
                    , unitW = RVO.Vector.divide(w, wLength)
                    , u = RVO.Vector.multiply(unitW, combinedRadius * invTimeHorizon - wLength);

                line[1] = [unitW[1], - unitW[0]];
            }
            else {
                var leg = Math.sqrt(distSq - combinedRadius);

                if (RVO.Vector.det(relativePosition, w) > 0) {
                    line[1] = RVO.Vector.divide([relativePosition[0] * leg - relativePosition[1] * combinedRadius, relativePosition[0] * combinedRadius + relativePosition[1] * leg], distSq)
                }
                else {
                    line[1] = RVO.Vector.divide(RVO.Vector.invert([relativePosition[0] * leg - relativePosition[1] * combinedRadius, relativePosition[0] * combinedRadius + relativePosition[1] * leg]), distSq)
                }

                var dotProduct2 = RVO.Vector.dotProduct(relativeVelocity, line[1])
                    , u = RVO.Vector.multiply(RVO.Vector.subtract(line[1], relativeVelocity), dotProduct2);
            }
        }
        else {
            var invTimeStep = 1 / this.sim.timeStep
                , w = RVO.Vector.subtract(relativeVelocity, RVO.Vector.multiply(relativePosition, invTimeStep))
                , wLength = RVO.Vector.abs(w)
                , unitW = RVO.Vector.divide(w, wLength)
                , u = RVO.Vector.multiply(unitW, combinedRadius * invTimeStep - wLength);

            line[1] = [unitW[1], - unitW[0]];
        }

        line[0] = RVO.Vector.add(this.velocity, RVO.Vector.multiply(u, .5));
        this.orcaLines.push(line);
    }

    var lineFail = RVO.Agent.linearProgram2(this.orcaLines, this.maxSpeed, this.prefVelocity, false, this.newVelocity);

    if (lineFail < this.orcaLines.length) {
        RVO.Agent.linearProgram3(this.orcaLines, numObstLines, lineFail, this.maxSpeed, this.newVelocity);
    }
}

/**
 * 插入代理邻居
 * @param {*} agent 
 * @param {*} rangeSq 
 */
RVO.Agent.prototype.insertAgentNeighbor = function (agent, rangeSq) {
    if (this != agent) {
        var distSq = RVO.Vector.absSq(RVO.Vector.subtract(this.position, agent.position));

        if (distSq < rangeSq) {
            if (this.agentNeighbors.length < this.maxNeighbors) {
                this.agentNeighbors.push([distSq, agent]);
            }

            var i = this.agentNeighbors.length - 1;
            while (i != 0 && distSq < this.agentNeighbors[i - 1][0]) {
                this.agentNeighbors[i] = this.agentNeighbors[i - 1];
                --i;
            }
            this.agentNeighbors[i] = [distSq, agent];

            if (this.agentNeighbors.length == this.maxNeighbors) {
                var rangeSq = this.agentNeighbors[this.agentNeighbors.length - 1][0];
            }
        }
    }

    return rangeSq;
}

/**
 * 
 * @param {*} obstacle 
 * @param {*} rangeSq 
 */
RVO.Agent.prototype.insertObstacleNeighbor = function (obstacle, rangeSq) {
    var nextObstacle = obstacle.nextObstacle
        , distSq = RVO.Vector.distSqPointLineSegment(obstacle.point, nextObstacle.point, this.position);

    if (distSq < rangeSq) {
        this.obstacleNeighbors.push([distSq, obstacle]);

        var i = this.obstacleNeighbors.length - 1;
        while (i != 0 && distSq < this.obstacleNeighbors[i - 1][0]) {
            this.obstacleNeighbors[i] = this.obstacleNeighbors[i - 1];
            --i;
        }
        this.obstacleNeighbors[i] = [distSq, obstacle];
    }
}

/**更新 */
RVO.Agent.prototype.update = function () {
    this.velocity = this.newVelocity;
    RVO.Vector.shift(this.position, RVO.Vector.multiply(this.velocity, this.sim.timeStep));
}

/**
 * 
 * @param {*} lines 
 * @param {*} lineNo 
 * @param {*} radius 
 * @param {*} optVelocity 
 * @param {*} directionOpt 
 * @param {*} result 
 */
RVO.Agent.linearProgram1 = function (lines, lineNo, radius, optVelocity, directionOpt, result) {
    var dotProduct = RVO.Vector.dotProduct(lines[lineNo][0], lines[lineNo][1])
        , discriminant = RVO.sqr(dotProduct) + RVO.sqr(radius) - RVO.Vector.absSq(lines[lineNo][0]);

    if (discriminant < 0) {
        return false;
    }

    var sqrtDiscriminant = Math.sqrt(discriminant)
        , tLeft = - dotProduct - sqrtDiscriminant
        , tRight = - dotProduct + sqrtDiscriminant;

    for (var i = 0; i < lineNo; ++i) {
        var denominator = RVO.Vector.det(lines[lineNo][1], lines[i][1])
            , numerator = RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[lineNo][0], lines[i][0]));

        if (Math.abs(denominator) <= RVO.EPSILON) {
            if (numerator < 0) {
                return false;
            }
            else {
                continue;
            }
        }

        var t = numerator / denominator;

        if (denominator > 0) {
            tRight = Math.min(tRight, t);
        }
        else {
            tLeft = Math.max(tLeft, t);
        }

        if (tLeft > tRight) {
            return false;
        }
    }

    if (directionOpt) {
        if (RVO.Vector.dotProduct(optVelocity, lines[lineNo][1]) > 0) {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tRight)));
        }
        else {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tLeft)));
        }
    }
    else {
        t = RVO.Vector.dotProduct(lines[lineNo][1], RVO.Vector.subtract(optVelocity, lines[lineNo][0]));

        if (t < tLeft) {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tLeft)));
        }
        else if (t > tRight) {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], tRight)));
        }
        else {
            RVO.Vector.set(result, RVO.Vector.add(lines[lineNo][0], RVO.Vector.multiply(lines[lineNo][1], t)));
        }
    }

    return true;
}

/**
 * 线性程序2
 * @param {*} lines 
 * @param {*} radius 
 * @param {*} optVelocity 
 * @param {*} directionOpt 
 * @param {*} result 
 */
RVO.Agent.linearProgram2 = function (lines, radius, optVelocity, directionOpt, result) {
    if (directionOpt) {
        RVO.Vector.set(result, RVO.Vector.multiply(optVelocity, radius));
    }
    else if (RVO.Vector.absSq(optVelocity) > RVO.sqr(radius)) {
        RVO.Vector.set(result, RVO.Vector.multiply(RVO.Vector.normalize(optVelocity), radius));
    }
    else {
        RVO.Vector.set(result, optVelocity);
    }

    for (var i = 0, len = lines.length; i < len; ++i) {
        if (RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[i][0], result)) > 0) {
            var tempResult = result.slice();
            if (!RVO.Agent.linearProgram1(lines, i, radius, optVelocity, directionOpt, result)) {
                RVO.Vector.set(result, tempResult);
                return i;
            }
        }
    }

    return lines.length;
}

/**
 * 线性程序3
 * @param {*} lines 
 * @param {*} numObstLines 
 * @param {*} beginLine 
 * @param {*} radius 
 * @param {*} result 
 */
RVO.Agent.linearProgram3 = function (lines, numObstLines, beginLine, radius, result) {
    var distance = 0;

    for (var i = beginLine, len = lines.length; i < len; ++i) {
        if (RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[i][0], result)) > distance) {
            var projLines = lines.slice(0, numObstLines);

            for (var j = numObstLines; j < i; ++j) {
                var line = new Array(2)
                    , determinant = RVO.Vector.det(lines[i][1], lines[j][1]);

                if (Math.abs(determinant) <= RVO.EPSILON) {
                    if (RVO.Vector.dotProduct(lines[i][1], lines[j][1]) > 0) {
                        continue;
                    }
                    else {
                        line[0] = RVO.Vector.multiply(RVO.Vector.add(lines[i][0], lines[j][0]), .5);
                    }
                }
                else {
                    line[0] = RVO.Vector.add(lines[i][0], RVO.Vector.multiply(lines[i][1], RVO.Vector.det(lines[j][1], RVO.Vector.subtract(lines[i][0], lines[j][0])) / determinant))
                }

                line[1] = RVO.Vector.normalize(RVO.Vector.subtract(lines[j][1], lines[i][1]));
                projLines.push(line);
            }

            var tempResult = result.slice();
            if (RVO.Agent.linearProgram2(projLines, radius, [- lines[i][1][1], lines[i][1][0]], true, result) < projLines.length) {
                RVO.Vector.set(result, tempResult);
            }

            distance = RVO.Vector.det(lines[i][1], RVO.Vector.subtract(lines[i][0], result));
        }
    }
}

var RVO = RVO || {};

/**
 * 
 * @param {*} sim 
 */
RVO.KdTree = function (sim) {
    this.sim = sim;
    this.agents = [];
    this.agentTree = [];
    this.obstacleTree = 0;
}

RVO.KdTree.MAX_LEAF_SIZE = 10;

/**
 * 
 */
RVO.KdTree.prototype.buildAgentTree = function () {
    if (this.agents.length < this.sim.agents.length) {
        for (var i = this.agents.length, len = this.sim.agents.length; i < len; ++i) {
            this.agents.push(this.sim.agents[i]);
        }
    }

    this.agentTree = [];
    if (this.agents.length) {
        this.buildAgentTreeRecursive(0, this.agents.length, 0);
    }
}

/**
 * 
 * @param {*} begin 
 * @param {*} end 
 * @param {*} node 
 */
RVO.KdTree.prototype.buildAgentTreeRecursive = function (begin, end, node) {
    var agent = this.agentTree[node] = new RVO.KdTree.AgentTreeNode;
    agent.begin = begin;
    agent.end = end;

    agent.minX = agent.maxX = this.agents[begin].position[0];
    agent.minY = agent.maxY = this.agents[begin].position[1];

    for (var i = begin + 1; i < end; ++i) {
        agent.maxX = Math.max(agent.maxX, this.agents[i].position[0]);
        agent.minX = Math.min(agent.minX, this.agents[i].position[0]);
        agent.maxY = Math.max(agent.maxY, this.agents[i].position[1]);
        agent.minY = Math.min(agent.minY, this.agents[i].position[1]);
    }

    if (end - begin > RVO.KdTree.MAX_LEAF_SIZE) {
        var isVertical = agent.maxX - agent.minX > agent.maxY - agent.minY
            , splitValue = isVertical ? .5 * (agent.maxX + agent.minX) : .5 * (agent.maxY + agent.minY)
            , left = begin
            , right = end - 1;

        while (true) {
            while (left <= right && (isVertical ? this.agents[left].position[0] : this.agents[left].position[1]) < splitValue) {
                ++left;
            }

            while (right >= left && (isVertical ? this.agents[right].position[0] : this.agents[right].position[1]) >= splitValue) {
                --right;
            }

            if (left > right) {
                break;
            }
            else {
                var tmp = this.agents[right];
                this.agents[right] = this.agents[left];
                this.agents[left] = tmp;
                ++left;
                --right;
            }
        }

        var leftSize = left - begin;

        if (leftSize == 0) {
            ++leftSize;
            ++left;
            ++right;
        }

        agent.left = node + 1;
        agent.right = node + 1 + (2 * leftSize - 1);

        this.buildAgentTreeRecursive(begin, left, agent.left);
        this.buildAgentTreeRecursive(left, end, agent.right);
    }
}

RVO.KdTree.prototype.buildObstacleTree = function () {
    var obstacles = [];

    for (var i = 0, len = this.sim.obstacles.length; i < len; ++i) {
        obstacles[i] = this.sim.obstacles[i];
    }

    this.obstacleTree = this.buildObstacleTreeRecursive(obstacles);
}

/**
 * 
 * @param {*} obstacles 
 */
RVO.KdTree.prototype.buildObstacleTreeRecursive = function (obstacles) {
    if (!obstacles.length) {
        return 0;
    }
    else {
        var node = new RVO.KdTree.ObstacleTreeNode
            , optimalSplit = 0
            , obstaclesLength = obstacles.length
            , minLeft = obstaclesLength
            , minRight = obstaclesLength;

        for (var i = 0; i < obstaclesLength; ++i) {
            var leftSize = 0
                , rightSize = 0
                , obstacleI1 = obstacles[i]
                , obstacleI2 = obstacleI1.nextObstacle;

            for (var j = 0; j < obstaclesLength; ++j) {
                if (i != j) {
                    var obstacleJ1 = obstacles[j]
                        , obstacleJ2 = obstacleJ1.nextObstacle
                        , j1LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point)
                        , j2LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);

                    if (j1LeftOfI >= - RVO.EPSILON && j2LeftOfI >= - RVO.EPSILON) {
                        ++leftSize;
                    }
                    else if (j1LeftOfI <= RVO.EPSILON && j2LeftOfI <= RVO.EPSILON) {
                        ++rightSize;
                    }
                    else {
                        ++leftSize;
                        ++rightSize;
                    }

                    if (Math.max(leftSize, rightSize) >= Math.min(minLeft, minRight) || Math.min(leftSize, rightSize) >= Math.min(minLeft, minRight)) {
                        break;
                    }
                }
            }

            if (Math.max(leftSize, rightSize) < Math.max(minLeft, minRight) || Math.min(leftSize, rightSize) < Math.min(minLeft, minRight)) {
                minLeft = leftSize;
                minRight = rightSize;
                optimalSplit = i;
            }
        }

        var leftObstacles = []
            , rightObstacles = []
            , i = optimalSplit
            , obstacleI1 = obstacles[i]
            , obstacleI2 = obstacleI1.nextObstacle;

        for (var j = 0, len = obstacles.length; j < len; ++j) {
            if (i != j) {
                var obstacleJ1 = obstacles[j]
                    , obstacleJ2 = obstacleJ1.nextObstacle
                    , j1LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ1.point)
                    , j2LeftOfI = RVO.Vector.leftOf(obstacleI1.point, obstacleI2.point, obstacleJ2.point);

                if (j1LeftOfI >= - RVO.EPSILON && j2LeftOfI >= - RVO.EPSILON) {
                    leftObstacles.push(obstacles[j]);
                }
                else if (j1LeftOfI <= RVO.EPSILON && j2LeftOfI <= RVO.EPSILON) {
                    rightObstacles.push(obstacles[j]);
                }
                else {
                    var t = RVO.Vector.det(RVO.Vector.subtract(obstacleI2.point, obstacleI1.point), RVO.Vector.subtract(obstacleJ1.point, obstacleI1.point)) / RVO.Vector.det(RVO.Vector.subtract(obstacleI2.point, obstacleI1.point), RVO.Vector.subtract(obstacleJ1.point, obstacleJ2.point))
                        , splitPoint = RVO.Vector.add(RVO.Vector.multiply(RVO.Vector.subtract(obstacleJ1.point, obstacleJ2.point), t), obstacleJ1.point)
                        , newObstacle = new RVO.Obstacle();

                    newObstacle.point = splitPoint;
                    newObstacle.prevObstacle = obstacleJ1;
                    newObstacle.nextObstacle = obstacleJ2;
                    newObstacle.isConvex = true;
                    newObstacle.unitTDir = obstacleJ1.unitDir;
                    newObstacle.id = this.sim.obstacles.length;

                    this.sim.obstacles.push(newObstacle);

                    obstacleJ1.nextObstacle = newObstacle;
                    obstacleJ2.prevObstacle = newObstacle;

                    if (j1LeftOfI > 0) {
                        leftObstacles.push(obstacleJ1);
                        rightObstacles.push(newObstacle);
                    }
                    else {
                        rightObstacles.push(obstacleJ1);
                        leftObstacles.push(newObstacle);
                    }
                }
            }
        }

        node.obstacle = obstacleI1;
        node.left = this.buildObstacleTreeRecursive(leftObstacles);
        node.right = this.buildObstacleTreeRecursive(rightObstacles);
        return node;
    }
}


/**
 * 
 * @param {*} agent 
 * @param {*} rangeSq 
 */
RVO.KdTree.prototype.computeAgentNeighbors = function (agent, rangeSq) {
    this.queryAgentTreeRecursive(agent, rangeSq, 0);
}

/**
 * 
 * @param {*} agent 
 * @param {*} rangeSq 
 */
RVO.KdTree.prototype.computeObstacleNeighbors = function (agent, rangeSq) {
    this.queryObstacleTreeRecursive(agent, rangeSq, this.obstacleTree);
}

/**
 * 
 * @param {*} agent 
 * @param {*} rangeSq 
 * @param {*} node 
 */
RVO.KdTree.prototype.queryAgentTreeRecursive = function (agent, rangeSq, node) {
    var nodeAgent = this.agentTree[node]
        , newRangeSq = rangeSq;
    if (nodeAgent.end - nodeAgent.begin <= RVO.KdTree.MAX_LEAF_SIZE) {
        for (var i = nodeAgent.begin, len = nodeAgent.end; i < len; ++i) {
            newRangeSq = agent.insertAgentNeighbor(this.agents[i], newRangeSq);
        }
    }
    else {
        var distSqLeft = 0
            , distSqRight = 0
            , leftAgent = this.agentTree[nodeAgent.left]
            , rightAgent = this.agentTree[nodeAgent.right];

        if (agent.position[0] < leftAgent.minX) {
            distSqLeft += RVO.sqr(leftAgent.minX - agent.position[0]);
        }
        else if (agent.position[0] > leftAgent.maxX) {
            distSqLeft += RVO.sqr(agent.position[0] - leftAgent.maxX);
        }

        if (agent.position[1] < leftAgent.minY) {
            distSqLeft += RVO.sqr(leftAgent.minY - agent.position[1]);
        }
        else if (agent.position[1] > leftAgent.maxY) {
            distSqLeft += RVO.sqr(agent.position[1] - leftAgent.maxY);
        }

        if (agent.position[0] < rightAgent.minX) {
            distSqRight += RVO.sqr(rightAgent.minX - agent.position[0]);
        }
        else if (agent.position[0] > rightAgent.maxX) {
            distSqRight += RVO.sqr(agent.position[0] - rightAgent.maxX);
        }

        if (agent.position[1] < rightAgent.minY) {
            distSqRight += RVO.sqr(rightAgent.minY - agent.position[1]);
        }
        else if (agent.position[1] > rightAgent.maxY) {
            distSqRight += RVO.sqr(agent.position[1] - rightAgent.maxY);
        }

        if (distSqLeft < distSqRight) {
            if (distSqLeft < rangeSq) {
                newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.left);

                if (distSqRight < rangeSq) {
                    newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.right);
                }
            }
        }
        else {
            if (distSqRight < rangeSq) {
                newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.right);

                if (distSqLeft < rangeSq) {
                    newRangeSq = this.queryAgentTreeRecursive(agent, newRangeSq, nodeAgent.left);
                }
            }
        }
    }
    return newRangeSq;
}

/**
 * 
 * @param {*} agent 
 * @param {*} rangeSq 
 * @param {*} node 
 */
RVO.KdTree.prototype.queryObstacleTreeRecursive = function (agent, rangeSq, node) {
    if (node == 0) {
        return;
    }
    else {
        var obstacle1 = node.obstacle
            , obstacle2 = obstacle1.nextObstacle
            , agentLeftOfLine = RVO.Vector.leftOf(obstacle1.point, obstacle2.point, agent.position)
            , distSqLine = RVO.sqr(agentLeftOfLine) / RVO.Vector.absSq(RVO.Vector.subtract(obstacle2.point, obstacle1.point));

        this.queryObstacleTreeRecursive(agent, rangeSq, agentLeftOfLine >= 0 ? node.left : node.right);

        if (distSqLine < rangeSq) {
            if (agentLeftOfLine < 0) {
                agent.insertObstacleNeighbor(node.obstacle, rangeSq);
            }

            this.queryObstacleTreeRecursive(agent, rangeSq, agentLeftOfLine >= 0 ? node.right : node.left);
        }
    }
}

/**
 * 
 * @param {*} q1 
 * @param {*} q2 
 * @param {*} radius 
 */
RVO.KdTree.prototype.queryVisibility = function (q1, q2, radius) {
    return this.queryVisibilityRecursive(q1, q2, radius, this.obstacleTree)
}

/**
 * 
 * @param {*} q1 
 * @param {*} q2 
 * @param {*} radius 
 * @param {*} node 
 */
RVO.KdTree.prototype.queryVisibilityRecursive = function (q1, q2, radius, node) {
    if (node.obstacleNo == -1) {
        return true;
    }
    else {
        var obstacle = this.sim.obstacles[node.obstacleNo]
            , q1LeftOfI = RVO.Vector.leftOf(obstacle.point1, obstacle.point2, q1)
            , q2LeftOfI = RVO.Vector.leftOf(obstacle.point1, obstacle.point2, q2);

        if (q1LeftOfI >= 0 && q2LeftOfI >= 0) {
            return this.queryVisibilityRecursive(q1, q2, radius, node.left);
        }
        else if (q1LeftOfI <= 0 && q2LeftOfI <= 0) {
            return this.queryVisibilityRecursive(q1, q2, radius, node.right);
        }
        else {
            var point1LeftOfQ = RVO.Vector.leftOf(q1, q2, obstacle.point1)
                , point2LeftOfQ = RVO.Vector.leftOf(q1, q2, obstacle.point2)
                , invLengthQ = 1 / RVO.Vector.absSq(RVO.Vector.subtract(q2, q1));;

            return point1LeftOfQ * point2LeftOfQ >= 0 && RVO.sqr(point1LeftOfQ) * invLengthQ >= RVO.sqr(radius) && RVO.sqr(point2LeftOfQ) * invLengthQ >= RVO.sqr(radius) && this.queryVisibilityRecursive(q1, q2, radius, node.left) && this.queryVisibilityRecursive(q1, q2, radius, node.right);
        }
    }
}

RVO.KdTree.AgentTreeNode = function () {
    this.begin = 0;
    this.end = 0;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
    this.left = 0;
    this.right = 0;
}

RVO.KdTree.ObstacleTreeNode = function () {
    this.left = null;
    this.right = null;
    this.obstacle = 0;
}
var RVO = RVO || {};

RVO.Obstacle = function () {
    this.isConvex = false;
    this.nextobstacle = 0;
    this.point = [0, 0];
    this.prevObstacle = 0;
    this.unitDir = [0, 0];
    this.id = 0;
}

var RVO = RVO || {};

/**小量 */
RVO.EPSILON = .00001;

RVO.agentDefaults = {
    neighborDist: 50,
    maxNeighbors: 5,
    maxSpeed: 1,
    radius: 10,
    timeHorizon: 10,
    velocity: [0, 0]
}

/**平方 */
RVO.sqr = function (a) {
    return a * a;
}

if (typeof define === "function" && define.amd && define.amd.RVO) {
    define('RVO', [], function () {
        return RVO;
    });
}

if (typeof module === 'object' && module.exports) {
    module.exports = RVO;
}

var RVO = RVO || {};
/**
 * 模拟器
 * @param {*} timeStep 时间步数
 * @param {*} neighborDist 
 * @param {*} maxNeighbors 
 * @param {*} timeHorizon 
 * @param {*} timeHorizonObst 
 * @param {*} radius 
 * @param {*} maxSpeed 
 * @param {*} velocity 
 */
RVO.Simulator = function (timeStep, neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocity) {
    this.timeStep = timeStep;
    this.agents = [];
    this.globalTime = 0;
    this.obstacles = [];
    this.kdTree = new RVO.KdTree(this);
    this.agentDefaults = {};

    this.agentDefaults.neighborDist = neighborDist || RVO.agentDefaults.neighborDist;
    this.agentDefaults.maxNeighbors = maxNeighbors || RVO.agentDefaults.maxNeighbors;
    this.agentDefaults.maxSpeed = maxSpeed || RVO.agentDefaults.maxSpeed;
    this.agentDefaults.radius = radius || RVO.agentDefaults.radius;
    this.agentDefaults.timeHorizon = timeHorizon || RVO.agentdefaults.timeHorizon;
    this.agentDefaults.timeHorizonObst = timeHorizonObst || RVO.agentDefaults.timeHorizonObst;
    this.agentDefaults.velocity = velocity || RVO.agentdefaults.velocity;
}

/**
 * 
 * @param {*} position 位置
 * @param {*} neighborDist 
 * @param {*} maxNeighbors 
 * @param {*} timeHorizon 
 * @param {*} timeHorizonObst 
 * @param {*} radius 
 * @param {*} maxSpeed 
 * @param {*} velocity 
 */
RVO.Simulator.prototype.addAgent = function (position, neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocity) {
    var agent = new RVO.Agent(this);

    agent.position = position || this.agentDefaults.position;
    agent.maxNeighbors = maxNeighbors || this.agentDefaults.maxNeighbors;
    agent.maxSpeed = maxSpeed || this.agentDefaults.maxSpeed;
    agent.neighborDist = neighborDist || this.agentDefaults.neighborDist;
    agent.radius = radius || this.agentDefaults.radius;
    agent.timeHorizon = timeHorizon || this.agentDefaults.timeHorizon;
    agent.timeHorizonObst = timeHorizonObst || this.agentDefaults.timeHorizonObst;
    agent.velocity = velocity || this.agentDefaults.velocity;
    agent.id = this.agents.length;

    this.agents.push(agent);

    return this.agents.length - 1;
}

/**
 * 添加障碍
 * @param {[[number,number]]} vertices 变量组 
 * @returns {number}
 * 
 */
RVO.Simulator.prototype.addObstacle = function (vertices) {
    /**顶点障碍物 */
    if (vertices.length < 2) {
        /**使用少于两个顶点创建障碍物 */
        throw new Error('Obstacle created with less than two vertices');
    }

    /**障碍组长度    */
    var obstacleNo = this.obstacles.length;

    for (var i = 0, len = vertices.length; i < len; ++i) {
        /**阻碍 = 新 阻碍 */
        var obstacle = new RVO.Obstacle();
        /**阻碍 点 = 向量组[u] */
        obstacle.point = vertices[i];
        /**如果 i!==0 */
        if (i != 0) {
            /**障碍 预先障碍 = 障碍组 最后一个 */
            obstacle.prevObstacle = this.obstacles[this.obstacles.length - 1];
            /**障碍 预先障碍 下一个障碍 = 障碍 */
            obstacle.prevObstacle.nextObstacle = obstacle;
        }
        /**如果 i = 向量组长度 */
        if (i == vertices.length - 1) {
            /**障碍 下一个障碍 = 障碍[障碍组长度] */
            obstacle.nextObstacle = this.obstacles[obstacleNo];
            /**障碍 下一个障碍 预先障碍 = 障碍 */
            obstacle.nextObstacle.prevObstacle = obstacle;
        }
        /**障碍 单位方向 = 法向量(下一个 减当前 ) */
        obstacle.unitDir = RVO.Vector.normalize(RVO.Vector.subtract(vertices[i == vertices.length - 1 ? 0 : i + 1], vertices[i]));

        /**如果 (变量组 长度 == 2) */
        if (vertices.length == 2) {
            /**阻碍 是凸的 = true  */
            obstacle.isConvex = true;
        }
        else {
            /**阻碍 是盒子 =    */
            obstacle.isConvex = (RVO.Vector.leftOf(vertices[i == 0 ? vertices.length - 1 : i - 1], vertices[i], vertices[i == vertices.length - 1 ? 0 : i + 1]) >= 0);
        }
        /**阻碍 id  = 阻碍组 长度 */
        obstacle.id = this.obstacles.length;
        /**阻碍组 添加 阻碍 */
        this.obstacles.push(obstacle);
    }
    //返回 障碍组长度
    return obstacleNo;
}

/**进行障碍组 */
RVO.Simulator.prototype.processObstacles = function () {
    /**kd树 创建障碍树() */
    this.kdTree.buildObstacleTree();
}

RVO.Simulator.prototype.doStep = function () {
    /**kd树 创建代理树() */
    this.kdTree.buildAgentTree();

    for (var i = 0, len = this.agents.length; i < len; ++i) {
        /**代理组[i] 计算邻居组() */
        this.agents[i].computeNeighbors();
        /**代理组[i] 计算新速度() */
        this.agents[i].computeNewVelocity();
    }

    for (var i = 0, len = this.agents.length; i < len; ++i) {
        /**代理组[i] 更新() */
        this.agents[i].update();
    }

    /**全球时间模拟 += 时间步数 */
    this.globalTime += this.timeStep;
}

var RVO = RVO || {};


/**向量 */
RVO.Vector = {};

/**
 * 求反
 * @param {[number,number]}a
 * @return {[nmuber,number]}
 */
RVO.Vector.invert = function (a) {
    return [- a[0], - a[1]];
}

/**数量积
 * @param {[number,number]} a
 * @param {[number,number]} b
 * @return {nmuber}
 * 
*/
RVO.Vector.dotProduct = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

/**相乘
 * @param {[number,number]} a
 * @param {number} b
 * @returns {[nmuber,number]} 
 * 
*/
RVO.Vector.multiply = function (a, b) {
    return [a[0] * b, a[1] * b];
}

/**相除
 * @param {[number,number]} a
 * @param {number} b
 * @returns {[nmuber,number]} 
 * 
*/
RVO.Vector.divide = function (a, b) {
    return [a[0] / b, a[1] / b];
}

/**加
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[nmuber,number]} 
 */
RVO.Vector.add = function (a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}

/**减
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[nmuber,number]} 
 */
RVO.Vector.subtract = function (a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}


/**移动
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[nmuber,number]} 
 */
RVO.Vector.shift = function (a, b) {
    a[0] += b[0];
    a[1] += b[1];
    return a;
}

/**设置
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {[nmuber,number]} 
 */
RVO.Vector.set = function (a, b) {
    a[0] = b[0];
    a[1] = b[1];
    return a;
}


/**
 * 距离
 * 数量积平方根
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {nmuber} 
 */
RVO.Vector.abs = function (a) {
    return Math.sqrt(RVO.Vector.dotProduct(a, a));
}

/** 
 * 数量积 
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {nmuber} 
 * */
RVO.Vector.absSq = function (a) {
    return RVO.Vector.dotProduct(a, a);
}

/**向量积
 * @param {[number,number]} a
 * @param {[number,number]} b 
 * @return {nmuber}  
 * */
RVO.Vector.det = function (a, b) {
    return a[0] * b[1] - a[1] * b[0];
}


/**法向量 
 * @param {[number,number]} a 
 * @returns {[nmuber,number]} 
 *  
 */
RVO.Vector.normalize = function (a) {
    return RVO.Vector.divide(a, RVO.Vector.abs(a));
}

/**在左边 */
RVO.Vector.leftOf = function (a, b, c) {
    return RVO.Vector.det(RVO.Vector.subtract(a, c), RVO.Vector.subtract(b, a));
}

/**点线段距离 
 *  
 * @param {[number,number]} a 
 * @param {[number,number]} b 
 * @param {[number,number]} c
 * @returns {[nmuber,number]} 
*/
RVO.Vector.distSqPointLineSegment = function (a, b, c) {
    /**ba =  b减a */
    var ba = RVO.Vector.subtract(b, a)
    /**ca =  c减a */
    var ca = RVO.Vector.subtract(c, a)
    /**r = 数量积(c-a,b-a) / 数量积 b减a  */
    var r = RVO.Vector.dotProduct(ca, ba) / RVO.Vector.absSq(ba);

    /**如果(r<0 ) */
    if (r < 0) {
        /**返回 数量积 c-a */
        return RVO.Vector.absSq(ca);
    }
    /**如果(r> 1 ) */
    else if (r > 1) {
        /**返回 数量积 c-b */
        return RVO.Vector.absSq(RVO.Vector.subtract(c, b));
    }
    else {
        /**返回 数量积 c- 加 (相乘(ba,r) ,a)*/
        return RVO.Vector.absSq(RVO.Vector.subtract(c, RVO.Vector.add(RVO.Vector.multiply(ba, r), a)));
    }
}